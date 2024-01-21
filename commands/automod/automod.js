
const { MessageEmbed } = require('discord.js');
const Settings = require('../../settings.js');
const emoji = require('../../emoji.js');
const owner = Settings.bot.credits.developerId;

module.exports = {
  name: 'automod',
  aliases: ['am'],
  run: async (client, message, args) => {
    const prefix = await client.db8.get(`${message.guild.id}_prefix`) || Settings.bot.info.prefix;
    const arypton = await client.users.fetch(owner);

    const createEmbed = (title, description) => {
      return new MessageEmbed()
        .setColor(client.color)
        .setThumbnail(client.user.displayAvatarURL())
        .setAuthor(client.user.tag, client.user.displayAvatarURL())
        .setDescription(description)
        .setFooter(`Made by ${arypton.username} with 💞`, arypton.displayAvatarURL({ dynamic: true }));
    };

    switch (args[0]) {
      case 'enable':
        await message.guild.autoModerationRules.create({
          name: `Resist Anti Toxicity`,
          creatorId: client.user.id,
          enabled: true,
          eventType: 1,
          triggerType: 1,
          triggerMetadata:
          {
            keywordFilter: [`mo`]
          },
          actions: [
            {
              type: 1,
              metadata: {
                channel: message.channel,
                durationSeconds: 10,
                customMessage: 'This message has been blocked.'
              }
            }
          ]
        });
        await message.guild.autoModerationRules.create({
          name: `Resist Anti Pornography`,
          creatorId: client.user.id,
          enabled: true,
          eventType: 1,
          triggerType: 4,
          triggerMetadata:
          {
            presets: [1, 2, 3]
          },
          actions: [
            {
              type: 1,
              metadata: {
                channel: message.channel,
                durationSeconds: 10,
                customMessage: 'This message has been blocked.'
              }
            }
          ]
        });
        await message.guild.autoModerationRules.create({
          name: `Resist Anti Spam 1"`,
          creatorId: client.user.id,
          enabled: true,
          eventType: 1,
          triggerType: 3,
          actions: [
            {
              type: 1,
              metadata: {
                channel: message.channel,
                durationSeconds: 10,
                customMessage: 'This message has been blocked.'
              }
            }
          ]
        });
        await message.guild.autoModerationRules.create({
          name: `Resist Anti Spam 2`,
          creatorId: client.user.id,
          enabled: true,
          eventType: 1,
          triggerType: 5,
          triggerMetadata: {
            mentionTotalLimit: 5,
            mentionSpamRule: true
          },
          actions: [
            {
              type: 1,
              metadata: {
                channel: message.channel,
                durationSeconds: 10,
                customMessage: 'This message has been blocked.'
              }
            }
          ]
        })
        const eeee = createEmbed("AutoMod Settings", `Successfully enabled AutoMod settings.\nCurrent Status : ${emoji.util.disabler}${emoji.util.enabled}`);
        await message.channel.send({ embeds: [eeee] });
        break;

      default:
        return;
    }
  }
}