use anchor_lang::prelude::*;

declare_id!("8Ju3FWgNEftjMiueY5kFFJvWTM52kJ1sULYWo51BybEm");

#[program]
pub mod solana_twitter{

    use super::*;

    
    pub fn send_tweet(ctx:Context<SendTweet>, content: String)-> Result<()>{
        if content.chars().count() > 280 {
            return err!(Errors::ContentTooLong);
        }
        
        let my_tweet = &mut ctx.accounts.tweet_account;
        let signer = &ctx.accounts.sender;
        let clock = Clock::get().unwrap();


        my_tweet.author = *signer.key;
        my_tweet.content = content;
        my_tweet.timestamp = clock.unix_timestamp;
        Ok(())
    }
}




#[error_code]
pub enum Errors {
    #[msg("The tweet is too long")]
    ContentTooLong,
}


#[derive(Accounts)]
pub struct SendTweet<'info>{
    #[account(init, payer=sender, space=Tweet::LEN)]
    pub tweet_account: Account<'info, Tweet>,
    #[account(mut)]
    pub sender: Signer<'info>,
    pub system_program: Program<'info, System>
}

#[account]
pub struct Tweet{
    pub author: Pubkey,
    pub content: String,
    pub timestamp: i64,
}



const DISCRIMINATOR_LENGTH: usize = 8;
const PUBLIC_KEY_LENGTH: usize = 32;
const PUBLIC_TIMESTAMP_LENGTH: usize = 8;
const STRING_LENGTH_PREFIX: usize = 4; // Stores the size of the string.
const MAX_CONTENT_LENGTH: usize = 250 * 4; // 250 chars max.

impl Tweet{
    const LEN: usize = 
    DISCRIMINATOR_LENGTH+
    PUBLIC_KEY_LENGTH+
    PUBLIC_TIMESTAMP_LENGTH+
    STRING_LENGTH_PREFIX+
    MAX_CONTENT_LENGTH;
}
