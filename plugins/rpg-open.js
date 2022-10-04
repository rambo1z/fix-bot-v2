const rewards = {
    common: {
        xفلوس: 101,
        xاكس_بيx: 201,
        xزبالةx: 11,
        xجرعةx: [0, 1, 0, 1, 0, 0, 0, 0, 0],
        xصندوقx: [0, 1, 0, 1, 0, 0, 0, 0, 0, 0],
        xغير_معرفx: [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    },
    uncommon: {
        xزبالةx: 201,
        xاكس_بيx: 401,
        xزبالةx: 31,
        xجرعةx: [0, 1, 0, 0, 0, 0, 0],
        xالماسx: [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        xصندوقx: [0, 1, 0, 0, 0, 0, 0, 0],
        xغير_معرفx: [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
        xنادرx: [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        xخشبx: [0, 1, 0, 0, 0, 0],
        xحجرx: [0, 1, 0, 0, 0, 0],
        xخيطx: [0, 1, 0, 0, 0, 0]
    },
    mythic: {
        xفلوسx: 301,
        xاكس_بيx: 551,
        xزبالةx: 61,
        xجرعةx: [0, 1, 0, 0, 0, 0],
        xزمردx: [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        xالماسx: [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
        xذهبx: [0, 1, 0, 0, 0, 0, 0, 0, 0],
        xحديدx: [0, 1, 0, 0, 0, 0, 0, 0],
        xصندوقx: [0, 1, 0, 0, 0, 0],
        xغير_معرفx: [0, 1, 0, 0, 0, 0, 0, 0],
        xنادرx: [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
        xاسطوريx: [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        xحيوانx: [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        xخشبx: [0, 1, 0, 0, 0],
        xحجرx: [0, 1, 0, 0, 0],
        xخيطx: [0, 1, 0, 0, 0]
    },
    legendary: {
        xفلوسx: 401,
        xاكس_بيx: 601,
        xزبالةx: 101,
        xجرعةx: [0, 1, 0, 0, 0],
        xزمردx: [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
        xالماسx: [0, 1, 0, 0, 0, 0, 0, 0, 0],
        xذهبx: [0, 1, 0, 0, 0, 0, 0, 0],
        xحديدx: [0, 1, 0, 0, 0, 0, 0],
        xصندوقx: [0, 1, 0, 0],
        xغير_معرفx: [0, 1, 0, 0, 0, 0],
        xنادرx: [0, 1, 0, 0, 0, 0, 0, 0, 0],
        xاسطوريx: [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
        xحيوانx: [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
        xخشبx: [0, 1, 0, 0],
        xحجرx: [0, 1, 0, 0],
        xخيطx: [0, 1, 0, 0]
    },
    // pet: {
    //     petFood: [0, 1, 0, 0, 0],
    //     anjing: [],
    // }
}
let handler = async (m, { command, args, usedPrefix }) => {
    let user = global.db.data.users[m.sender]
    let listCrate = Object.fromEntries(Object.entries(rewards).filter(([v]) => v && v in user))
    let info = `
Use Format *${usedPrefix}${command} [crate] [count]*
Usage example: *${usedPrefix}${command} common 10*

📍قائمة الصناديق: 
${Object.keys(listCrate).map((v) => `
${rpg.emoticon(v)}${v}
`.trim()).join('\n')}
`.trim()
    let type = (args[0] || '').toLowerCase()
    let count = Math.floor(isNumber(args[1]) ? Math.min(Math.max(parseInt(args[1]), 1), Number.MAX_SAFE_INTEGER) : 1) * 1
    if (!(type in listCrate)) return m.reply(info)
    if (user[type] < count) return m.reply(`
الخاص بك *${rpg.emoticon(type)}${type} crate* لايكفي. انت اديك فقط ${user[type]} *${rpg.emoticon(type)}${type} crate*
اكتب *${usedPrefix}buy ${type} ${count - user[type]}* للشراء
`.trim())
    // TODO: add pet crate
    // if (type !== 'pet')
    let crateReward = {}
    for (let i = 0; i < count; i++)
        for (let [reward, value] of Object.entries(listCrate[type]))
            if (reward in user) {
                const total = value.getRandom()
                if (total) {
                    user[reward] += total * 1
                    crateReward[reward] = (crateReward[reward] || 0) + (total * 1)
                }
            }
    user[type] -= count * 1
    m.reply(`
لقد فتحت *${count}* ${global.rpg.emoticon(type)}${type} وحصلت على:
${Object.keys(crateReward).filter(v => v && crateReward[v] && !/legendary|pet|mythic|diamond|emerald/i.test(v)).map(reward => `
*${global.rpg.emoticon(reward)}${reward}:* ${crateReward[reward]}
`.trim()).join('\n')}
`.trim())
    let diamond = crateReward.diamond, mythic = crateReward.mythic, pet = crateReward.pet, legendary = crateReward.legendary, emerald = crateReward.emerald
    if (mythic || diamond) m.reply(`
تهانينا لقد حصلت على عنصر نادر ${diamond ? `*${diamond}* ${rpg.emoticon('diamond')}diamond` : ''}${diamond && mythic ? 'and ' : ''}${mythic ? `*${mythic}* ${rpg.emoticon('mythic')}mythic` : ''}
`.trim())
    if (pet || legendary || emerald) m.reply(`
تهانينا لقد حصلت على عنصر ملحمي ${pet ? `*${pet}* ${rpg.emoticon('pet')}pet` : ''}${pet && legendary && emerald ? ', ' : (pet && legendary || legendary && emerald || emerald && pet) ? 'and ' : ''}${legendary ? `*${legendary}* ${rpg.emoticon('legendary')}legendary` : ''}${pet && legendary && emerald ? 'and ' : ''}${emerald ? `*${emerald}* ${rpg.emoticon('emerald')}emerald` : ''}
`.trim())
}
handler.help = ['open', 'gacha'].map(v => v + ' [crate] [count]')
handler.tags = ['rpg']
handler.command = /^(open|buka|gacha)$/i

export default handler

function isNumber(number) {
    if (!number) return number
    number = parseInt(number)
    return typeof number == 'number' && !isNaN(number)
}
