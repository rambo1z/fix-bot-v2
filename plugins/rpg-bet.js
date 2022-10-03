let confirm = {}

async function handler(m, { conn, args }) {
    //if (!isROwner) throw 'Dalam perbaikan'
    if (m.sender in confirm) throw 'Kamu masih melakukan judi, tunggu sampai selesai!!'
    try {
        let user = global.db.data.users[m.sender]
        let count = (args[0] && number(parseInt(args[0])) ? Math.max(parseInt(args[0]), 1) : /all/i.test(args[0]) ? Math.floor(parseInt(user.money)) : 1) * 1
        if ((user.money * 1) < count) return m.reply('💹 انت لاتملك المال!!')
        if (!(m.sender in confirm)) {
            confirm[m.sender] = {
                sender: m.sender,
                count,
                timeout: setTimeout(() => (m.reply('timed out'), delete confirm[m.sender]), 60000)
            }
            let txt = `هل انت متاكد انك تريد المقامرة (Y/n)\n\n*الرهان بـ:* ${count} 💹\n⏰ 60s المهلة`
            return conn.sendButton(m.chat, txt, author, null, [['✔️'], ['✖️']], m)
        }
    } catch (e) {
        console.error(e)
        if (m.sender in confirm) {
            let { timeout } = confirm[m.sender]
            clearTimeout(timeout)
            delete confirm[m.sender]
            m.reply('Rejected')
        }
    }
}

handler.before = async m => {
    if (!(m.sender in confirm)) return
    if (m.isBaileys) return
    let { timeout, count } = confirm[m.sender]
    let user = global.db.data.users[m.sender]
    let moneyDulu = user.money * 1
    let txt = (m.msg && m.msg.selectedDisplayText ? m.msg.selectedDisplayText : m.text ? m.text : '').toLowerCase()
    try {
        if (/^(✔️|y(es|a))?$/i.test(txt)) {
            let Bot = (Math.ceil(Math.random() * 91)) * 1
            let Kamu = (Math.floor(Math.random() * 71)) * 1
            let status = 'Kalah'
            if (Bot < Kamu) {
                user.money += count * 1
                status = 'Menang'
            } else if (Bot > Kamu) {
                user.money -= count * 1
            } else {
                status = 'Seri'
                user.money += (Math.floor(count / 1.5)) * 1
            }
            m.reply(`
| *النقاط* | *اللاعبون* |
*🤖 اينو:*      ${Bot}
*👤 انت:*    ${Kamu}

انت *${status}*, انت ${status == 'فزت' ? `Xحصلت علىX *+${count * 2}*` : status == 'خسرت' ? `Xلقد فقدتX *-${count * 1}*` : `خصلت على *+${Math.floor(count / 1.5)}*`} فلوس 💹
    `.trim())
            clearTimeout(timeout)
            delete confirm[m.sender]
            return !0
        } else if (/^(✖️|no)?$/i.test(txt)) {
            clearTimeout(timeout)
            delete confirm[m.sender]
            m.reply('Rejected')
            return !0
        }

    } catch (e) {
        clearTimeout(timeout)
        delete confirm[m.sender]
        if (moneyDulu > (user.money * 1)) user.money = moneyDulu * 1
        m.reply('Error saat melakukan judi (Rejected)')
        return !0
    } finally {
        clearTimeout(timeout)
        delete confirm[m.sender]
        return !0
    }
}

handler.help = ['judi [jumlah]']
handler.tags = ['rpg']
handler.command = /^(judi|bet)$/i

export default handler

/**
 * Detect if thats number
 * @param {Number} x 
 * @returns Boolean
 */
function number(x = 0) {
    x = parseInt(x)
    return !isNaN(x) && typeof x == 'number'
}
