const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const Settings = require('../../settings.js');
const emoji = require('../../emoji.js');
const owner = Settings.bot.credits.developerId;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('invc')
        .setDescription('Manage InVC role settings for the server')
        .addStringOption(option =>
            option.setName('action')
                .setDescription('Select an action')
                .setRequired(true)
                .addChoice('config', 'config')
                .addChoice('humans', 'humans')
                .addChoice('bots', 'bots')
                .addChoice('reset', 'reset'))
        .addRoleOption(option =>
            option.setName('role')
                .setDescription('Select the role')
                .setRequired(false)),
    async execute(client, interaction) {
        const prefix = await client.db8.get(`${interaction.guild.id}_prefix`) || Settings.bot.info.prefix;
        const arypton = await client.users.fetch(owner);
        const action = interaction.options.getString('action');
        const role = interaction.options.getRole('role');

        const guide = createGuideEmbed(client, arypton);

        switch (action) {
            case 'config':
                const HumanRole = await client.db7.get(`invchumanrole_${interaction.guild.id}.HumanRole`) || "na";
                const BotRole = await client.db7.get(`invcbotrole_${interaction.guild.id}.BotRole`) || "na";

                let invcHumanRoleString;
                let invcBotRoleString;
                if (HumanRole === 'na') {
                    invcHumanRoleString = `\`Nothing To Show\``;
                } else {
                    const humanrole = interaction.guild.roles.cache.get(HumanRole);
                    invcHumanRoleString = humanrole ? `[1] | [${humanrole.id}](https://dsc.gg/resisthq) | \`${humanrole.name}\`` : `\`Invalid Role ID\``;
                }

                if (BotRole === 'na') {
                    invcBotRoleString = `\`Nothing To Show\``;
                } else {
                    const botrole = interaction.guild.roles.cache.get(BotRole);
                    invcBotRoleString = botrole ? `[1] | [${botrole.id}](https://dsc.gg/resisthq) | \`${botrole.name}\`` : `\`Invalid Role ID\``;
                }

                const embed = new MessageEmbed()
                    .setColor(client.color)
                    .setAuthor(client.user.tag, client.user.displayAvatarURL());

                if (invcHumanRoleString && invcHumanRoleString !== '') {
                    embed.addField(`InVC Humans Role`, invcHumanRoleString);
                }

                if (invcBotRoleString && invcBotRoleString !== '') {
                    embed.addField(`InVC Bot Role`, invcBotRoleString);
                }

                embed.setFooter(`Made by ${arypton.username} with 💞`, arypton.displayAvatarURL({ dynamic: true }));

                await interaction.reply({ embeds: [embed] });
                break;

            case 'humans':
                if (!role) {
                    await interaction.reply({ content: `${emoji.util.cross} | Provide a Role` });
                    return;
                }

                if (role.permissions.has("ADMINISTRATOR")) {
                    await interaction.reply({ content: `${emoji.util.cross} | \`ADMINISTRATOR\` Role cannot be Selected` });
                    return;
                }

                await client.db7.set(`invchumanrole_${interaction.guild.id}.HumanRole`, role.id);
                await client.db7.set(`invcroleguild_${interaction.guild.id}.Guild`, interaction.guild.id);
                await interaction.reply({ content: `${emoji.util.tick} | Successfully added \`${role.name}\` as InVC human Role` });
                break;

            case 'bots':
                if (!role) {
                    await interaction.reply({ content: `${emoji.util.cross} | Provide a Role` });
                    return;
                }

                if (role.permissions.has("ADMINISTRATOR")) {
                    await interaction.reply({ content: `${emoji.util.cross} | \`ADMINISTRATOR\` Role cannot be Selected` });
                    return;
                }

                await client.db7.set(`invcbotrole_${interaction.guild.id}.BotRole`, role.id);
                await client.db7.set(`invcroleguild_${interaction.guild.id}.Guild`, interaction.guild.id);
                await interaction.reply({ content: `${emoji.util.tick} | Successfully added \`${role.name}\` as InVC bot Role` });
                break;

            case 'reset':
                const promises = [
                    client.db7.delete(`invchumanrole_${interaction.guild.id}`),
                    client.db7.delete(`invcroleguild_${interaction.guild.id}.Guild`),
                    client.db7.delete(`invcbotrole_${interaction.guild.id}`),
                ];

                await Promise.all(promises);

                await interaction.reply(`InVC roles have been reset for this server.`);
                break;

            default:
                await interaction.reply({ embeds: [guide] });
                break;
        }
    }
}

function createGuideEmbed(client, arypton) {
    const guide = new MessageEmbed()
        .setAuthor({ name: `${arypton.username}`, iconURL: arypton.displayAvatarURL({ dynamic: true }) })
        .setThumbnail(client.user.displayAvatarURL())
        .setColor(client.color)
        .addField(`${emoji.util.arrow} \`invc config\``, "Shows InVC role settings for the server.")
        .addField(`${emoji.util.arrow} \`invc humans <role>\``, "Set up InVC human role settings for the server.")
        .addField(`${emoji.util.arrow} \`invc bots <role>\``, "Set up InVC bot role settings for the server.")
        .addField(`${emoji.util.arrow} \`invc reset\``, "Resets InVC role settings for the server.")
        .setFooter(`Made by ${arypton.username} with 💞`, arypton.displayAvatarURL({ dynamic: true }));

    return guide;
}
