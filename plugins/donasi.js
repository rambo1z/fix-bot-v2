let handler = async (m, { conn, usedPrefix: _p, __dirname, args }) => {
let text = `
┌─「قروب  • الدعم 」
│ • *الرابط:https://chat.whatsapp.com/L30GtP3peP6FfBzWk5MBdw* 
│ • *http://wa.me/9647735131102?text=*السلام🤍عليكم*
❏────
`.trim()
  m.reply(text)
}
handler.help = ['donasi']
handler.tags = ['info']
handler.command = /^dona(te|si)$/i

export default handler
