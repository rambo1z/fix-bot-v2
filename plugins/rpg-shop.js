const العناصر = {
    buy: {
        الحد: {
            اكس_بي: 999
        },
        جرعة: {
            فلوس: 1250,
        },
        زبالة: {
            فلوس: 4,
        },
        خشب: {
            فلوس: 700
        },
        حجر: {
            فلوس: 850
        },
        خيط: {
            فلوس: 400
        },
        حديد: { 
        	فلوس: 3000
        }
    },
    بيع: {
        جرعة: {
            فلوس: 125,
        },
        زبالة: {
            فلوس: 2
        },
        خشب: {
            فلوس: 600
        },
        حجر: {
            فلوس: 750
        },
        خيط: {
            فلوس: 300
        },
        حديد: {
            فلوس: 2500
        },
        ذهب: {
            فلوس: 4700
        },
        الماس: {
           فلوس: 9000
        },
        زمرد: {
            فلوس: 15000
        }
    }
}

let handler = async (m, { command, usedPrefix, args }) => {
    let user = global.db.data.users[m.sender]
    const listItems = Object.fromEntries(Object.entries(items[command.toLowerCase()]).filter(([v]) => v && v in user))
    const info = `
نسق الاستخدام *${usedPrefix}${command} [crate] [count]*
مثال على الاستخدام: *${usedPrefix}${command} potion 10*
    
📍قائمة الادوات: 
${Object.keys(listItems).map((v) => {
        let paymentMethod = Object.keys(listItems[v]).find(v => v in user)
        return `${global.rpg.emoticon(v)}${v} | ${listItems[v][paymentMethod]} ${global.rpg.emoticon(paymentMethod)}${paymentMethod}`.trim()
    }).join('\n')}
`.trim()
    const item = (args[0] || '').toLowerCase()
    const total = Math.floor(isNumber(args[1]) ? Math.min(Math.max(parseInt(args[1]), 1), Number.MAX_SAFE_INTEGER) : 1) * 1
    if (!listItems[item]) return m.reply(info)
    if (command.toLowerCase() == 'buy') {
        let paymentMethod = Object.keys(listItems[item]).find(v => v in user)
        if (user[paymentMethod] < listItems[item][paymentMethod] * total) return m.reply(`You don't have enough ${global.rpg.emoticon(paymentMethod)}${paymentMethod} to buy *${total}* ${global.rpg.emoticon(item)}${item}. You need *${(listItems[item][paymentMethod] * total) - user[paymentMethod]}* more ${paymentMethod} to be able to buy`)
        user[paymentMethod] -= listItems[item][paymentMethod] * total
        user[item] += total
        return m.reply(`You bought *${total}* ${global.rpg.emoticon(item)}${item}`)
    } else {
        if (user[item] < total) return m.reply(`ليس لديك مايكفي *${global.rpg.emoticon(item)}${item}* لديك فقط.  للبيع ${user[item]} items`)
        user[item] -= total
        user.money += listItems[item].money * total
        return m.reply(`You sold *${total}* ${global.rpg.emoticon(item)}${item}`)
    }
}

handler.help = ['buy', 'sell'].map(v => v + ' [item] [count]')
handler.tags = ['rpg']
handler.command = /^(buy|sell)$/i

handler.disabled = false

export default handler

function isNumber(number) {
    if (!number) return number
    number = parseInt(number)
    return typeof number == 'number' && !isNaN(number)
}
