const { getValidVerificationEmbed } = require('./embeds/verify');
const { IDs } = require('../config.json');
const roles = IDs.verificationRoles;
const setRoles = (playerData, user) => {
  const playerAchievement = playerData.achievements;
  const achieved = {
    legends: playerData.bestTrophies >= 5000,
    starLord: 
      playerData.warStars >= 1300 &&
      playerAchievement[33].value >= 500,
    farmersRUs:
      playerAchievement[5].value >= 2000000000 &&
      playerAchievement[6].value >= 2000000000 &&
      playerAchievement[16].value >= 20000000,
    masterBuilder: playerData.bestBuilderBaseTrophies >= 5000,
    philanthropist: playerAchievement[14].value >= 750000,
    greenThumb: playerAchievement[3].value >= 7500,
    masterGamer: playerAchievement[31].value >= 150000,
    conqueror: playerData?.legendStatistics?.bestSeason?.rank <= 1000,
    vanquisher: playerData?.legendStatistics?.bestBuilderBaseSeason?.rank <= 1000,
    capitalist: playerData?.clanCapitalContributions >= 3000000,
    member: playerData?.townHallLevel >= 5
  };

  addAchievementRoles(user, achieved);

  const thLevel = addTownhall(playerData, user);

  const noRoles =
    thLevel === 0 && Object.values(achieved).every((val) => val === false);

  return getValidVerificationEmbed(
    createValidVerificationEmbedDescription(achieved, thLevel, noRoles)
  );
};

const createValidVerificationEmbedDescription = (
  achieved,
  thLevel,
  noRoles
) => {
  if (noRoles) return `• Not eligible for any roles\n`;

  let thEmbedDesc = '';
  for (let thRole in roles.townhall) {
    if (roles.townhall[thRole].lvl === thLevel) {
      thEmbedDesc = `${roles.townhall[thRole].icon} <@&${roles.townhall[thRole].roleid}> added!\n`;
      break;
    }
  }

  return (
    (achieved.legends
      ? `${roles.prestige.legends.icon} <@&${roles.prestige.legends.roleid}> added!\n`
      : ``) +
    (achieved.starLord
      ? `${roles.prestige.starlord.icon} <@&${roles.prestige.starlord.roleid}> added!\n`
      : ``) +
    (achieved.farmersRUs
      ? `${roles.prestige.farmersrus.icon} <@&${roles.prestige.farmersrus.roleid}> added!\n`
      : ``) +
    (achieved.masterBuilder
      ? `${roles.prestige.masterbuilder.icon} <@&${roles.prestige.masterbuilder.roleid}> added!\n`
      : ``) +
    (achieved.philanthropist
      ? `${roles.prestige.philanthropist.icon} <@&${roles.prestige.philanthropist.roleid}> added!\n`
      : ``) +
    (achieved.greenThumb
      ? `${roles.prestige.greenthumb.icon} <@&${roles.prestige.greenthumb.roleid}> added!\n`
      : ``) +
    (achieved.masterGamer
      ? `${roles.prestige.mastergamer.icon} <@&${roles.prestige.mastergamer.roleid}> added!\n`
      : ``) +
    (achieved.conqueror
      ? `${roles.prestige.conqueror.icon} <@&${roles.prestige.conqueror.roleid}> added!\n`
      : ``) +  
    (achieved.vanquisher
      ? `${roles.prestige.vanquisher.icon} <@&${roles.prestige.vanquisher.roleid}> added!\n`
      : ``) + 
    (achieved.capitalist
      ? `${roles.prestige.capitalist.icon} <@&${roles.prestige.capitalist.roleid}> added!\n`
      : ``) + 
    (thLevel > 0 ? thEmbedDesc : ``) +
    (achieved.member
      ? `${roles.prestige.member.icon} <@&${roles.prestige.member.roleid}> added!\n`
      : ``) 
  );
};

const addAchievementRoles = (user, achieved) => {
  if (achieved.legends) user.roles.add(roles.prestige.legends.roleid);
  if (achieved.starLord) user.roles.add(roles.prestige.starlord.roleid);
  if (achieved.farmersRUs) user.roles.add(roles.prestige.farmersrus.roleid);
  if (achieved.masterBuilder)
    user.roles.add(roles.prestige.masterbuilder.roleid);
  if (achieved.philanthropist)
    user.roles.add(roles.prestige.philanthropist.roleid);
  if (achieved.greenThumb) user.roles.add(roles.prestige.greenthumb.roleid);
  if (achieved.masterGamer) user.roles.add(roles.prestige.mastergamer.roleid);
  if (achieved.conqueror) user.roles.add(roles.prestige.conqueror.roleid);
  if (achieved.vanquisher) user.roles.add(roles.prestige.vanquisher.roleid);
  if (achieved.capitalist) user.roles.add(roles.prestige.capitalist.roleid);
  if (achieved.member) user.roles.add(roles.prestige.member.roleid);
};

const addTownhall = (player, user) => {
  const oldThLevel = getOldThLevel(user);

  const newThLevel = player.townHallLevel;

  if (newThLevel > oldThLevel) {
    removeTH(user, player.townHallLevel);

    for (let thRole in roles.townhall) {
      if (roles.townhall[thRole].lvl === newThLevel) {
        user.roles.add(roles.townhall[thRole].roleid);
        return newThLevel;
      }
    }
  }

  return 0;
};

const getOldThLevel = (user) => {
  const user_roles = user.roles.cache;
  for (let i in roles.townhall) {
    if (user_roles.has(roles.townhall[i].roleid)) return roles.townhall[i].lvl;
  }
  return 0;
};

const removeTH = (user, lvl) => {
  const user_roles = user.roles.cache;
  for (let i in roles.townhall) {
    if (
      user_roles.has(roles.townhall[i].roleid) &&
      roles.townhall[i].lvl < lvl
    ) {
      user.roles.remove(roles.townhall[i].roleid);
    }
  }
};

module.exports = {
  setRoles,
};
