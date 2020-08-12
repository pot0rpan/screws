import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';

const PERM_ADMINISTRATOR = 0x8;
const PERM_MANAGE_SERVER = 0x20;

const signIn = async (_user, account, _profile) => {
  let isAllowed = false;
  const { accessToken } = account;
  let guilds;

  try {
    const guildsRes = await fetch(
      'https://discordapp.com/api/users/@me/guilds',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    guilds = await guildsRes.json();
  } catch (err) {
    console.log(err);
  }

  // Response is either an array of guild objects,
  // or a single error object with `message` and `code`
  if (guilds && Array.isArray(guilds)) {
    const guild = guilds.find((g) => g.id === process.env.DISCORD_SERVER_ID);
    const perms = +guild.permissions_new;

    if (guild) {
      // Only allow owner, administrator,
      // or anyone who can manage server (mods) to sign in
      if (
        guild.owner ||
        (perms & PERM_ADMINISTRATOR) === PERM_ADMINISTRATOR ||
        (perms & PERM_MANAGE_SERVER) === PERM_MANAGE_SERVER
      ) {
        isAllowed = true;
      }
    }
  }

  if (isAllowed) {
    return Promise.resolve(true);
  } else {
    return Promise.resolve(false);
  }
};

const options = {
  providers: [
    Providers.Discord({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
      scope: 'identify guilds',

      //! Remove once next-auth updates URL
      profileUrl: 'https://discord.com/api/users/@me',

      // Custom profile to remove email and add discriminator
      // But `name`, `email`, and `image` are only values allowed
      // per _getProfile() in next-auth/lib/oauth/callback.js
      // So discriminator is saved under email for now ¯\_(ツ)_/¯
      profile: (profile) => {
        return {
          id: profile.id,
          name: profile.username,
          email: profile.discriminator,
          image: `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`,
        };
      },
    }),
  ],
  callbacks: {
    signIn,
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    jwt: true,
  },
};

export default (req, res) => NextAuth(req, res, options);
