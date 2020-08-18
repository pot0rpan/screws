const WEBHOOK_URL = process.env.DISCORD_LOGS_WEBHOOK_URL;

export const Logger = {
  log: async (message: string, title: string = 'Generic Log') => {
    // Normal console log
    console.log(title, message);

    // Make sure webhook request only ever runs on server,
    // since url needs no authentication to use
    if (typeof window !== 'undefined' || !WEBHOOK_URL) return;

    // Post log in a Discord channel
    await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        embeds: [
          {
            title: `:warning: ${title}`,
            description: message,
            color: 16384133, // Screws red color
          },
        ],
      }),
    });
  },
};
