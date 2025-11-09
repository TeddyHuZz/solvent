use anchor_lang::prelude::*;
use anchor_lang::system_program::{transfer, Transfer};

declare_id!("AuXUBafybLucgxw65twLs4RrwDnXDnxnfQxRrzamiDpq");

#[program]
pub mod solvent {
    use super::*;

    // Instruction 1: initialize_tank
    pub fn initialize_tank(ctx: Context<InitializeTank>) -> Result<()> {
        let gas_tank = &mut ctx.accounts.gas_tank;
        gas_tank.owner = ctx.accounts.owner.key();
        gas_tank.bump = ctx.bumps.gas_tank;
        
        msg!("GasTank initialized for owner: {:?}", gas_tank.owner);
        Ok(())
    }

    // Instruction 2: deposit_sol
    pub fn deposit_sol(ctx: Context<DepositSol>, amount: u64) -> Result<()> {
        let cpi_context = CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            Transfer {
                from: ctx.accounts.owner.to_account_info(),
                to: ctx.accounts.gas_tank.to_account_info(),
            },
        );
        
        transfer(cpi_context, amount)?;
        
        msg!("Deposited {} lamports to GasTank", amount);
        Ok(())
    }

    // Instruction 3: set_config
    pub fn set_config(ctx: Context<SetConfig>, agent_pubkey: Pubkey, rules: Rules) -> Result<()> {
        let gas_tank = &mut ctx.accounts.gas_tank;
        gas_tank.agent = agent_pubkey;
        gas_tank.rules = rules;
        
        msg!("GasTank configured with agent: {:?}", agent_pubkey);
        Ok(())
    }

    // Instruction 4: agent_spend
    pub fn agent_spend(ctx: Context<AgentSpend>, amount: u64) -> Result<()> {
        let gas_tank = &ctx.accounts.gas_tank;
        
        require!(
            amount <= gas_tank.rules.max_spend_per_tx,
            ErrorCode::SpendingLimitExceeded
        );
        
        let gas_tank_lamports = gas_tank.to_account_info().lamports();
        require!(
            gas_tank_lamports >= amount,
            ErrorCode::InsufficientFunds
        );
        
        // Use checked arithmetic
        **gas_tank.to_account_info().try_borrow_mut_lamports()? = gas_tank_lamports
            .checked_sub(amount)
            .ok_or(ErrorCode::InsufficientFunds)?;
        
        let dest_lamports = ctx.accounts.destination.to_account_info().lamports();
        **ctx.accounts.destination.to_account_info().try_borrow_mut_lamports()? = dest_lamports
            .checked_add(amount)
            .ok_or(ErrorCode::InsufficientFunds)?;
        
        msg!("Agent spent {} lamports to {:?}", amount, ctx.accounts.destination.key());
        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeTank<'info> {
    #[account(
        init,
        payer = owner,
        space = 8 + 32 + 32 + 8 + 1,
        seeds = [b"gas_tank", owner.key().as_ref()],
        bump
    )]
    pub gas_tank: Account<'info, GasTank>,
    
    #[account(mut)]
    pub owner: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct DepositSol<'info> {
    #[account(
        mut,
        seeds = [b"gas_tank", owner.key().as_ref()],
        bump = gas_tank.bump
    )]
    pub gas_tank: Account<'info, GasTank>,
    
    #[account(mut)]
    pub owner: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct SetConfig<'info> {
    #[account(
        mut,
        has_one = owner,
        seeds = [b"gas_tank", owner.key().as_ref()],
        bump = gas_tank.bump
    )]
    pub gas_tank: Account<'info, GasTank>,
    
    pub owner: Signer<'info>,
}

#[derive(Accounts)]
pub struct AgentSpend<'info> {
    #[account(
        mut,
        has_one = agent,
        seeds = [b"gas_tank", gas_tank.owner.as_ref()],
        bump = gas_tank.bump
    )]
    pub gas_tank: Account<'info, GasTank>,
    
    pub agent: Signer<'info>,
    
    /// CHECK: This is the destination account receiving SOL
    #[account(mut)]
    pub destination: AccountInfo<'info>,
    
    pub system_program: Program<'info, System>,
}

#[account]
pub struct GasTank {
    pub owner: Pubkey,
    pub agent: Pubkey,
    pub rules: Rules,
    pub bump: u8,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy)]
pub struct Rules {
    pub max_spend_per_tx: u64,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Spending limit exceeded")]
    SpendingLimitExceeded,
    #[msg("Insufficient funds in gas tank")]
    InsufficientFunds,
}
