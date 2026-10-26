// Preencha com seu contato real para ativar o botão direto.
// WhatsApp: somente números, incluindo país e DDD. Exemplo de formato: 55 + DDD + número.
const CONTACT = { whatsapp: '', email: 'pixelc.contato@gmail.com' };
const byId = id => document.getElementById(id);
byId('year').textContent = new Date().getFullYear();
const direct = byId('direct-contact');
if (/^\d{12,13}$/.test(CONTACT.whatsapp)) {
  direct.href = `https://wa.me/${CONTACT.whatsapp}`;
  direct.target = '_blank'; direct.rel = 'noopener'; direct.hidden = false;
  byId('contact-note').textContent = 'Prefere conversar diretamente? Fale comigo pelo WhatsApp.';
} else if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(CONTACT.email)) {
  direct.href = `mailto:${CONTACT.email}`; direct.hidden = false;
  byId('contact-note').textContent = 'Prefere conversar diretamente? Envie sua ideia por e-mail.';
}
document.querySelectorAll('[data-kind]').forEach(link => link.addEventListener('click', () => {
  byId('kind').value = link.dataset.kind;
}));
byId('brief-form').addEventListener('submit', event => {
  event.preventDefault();
  const name = byId('name').value.trim(), idea = byId('idea').value.trim();
  if (name.length < 2 || idea.length < 15) {
    byId('status').textContent = 'Informe seu nome e descreva a ideia com pelo menos 15 caracteres.'; return;
  }
  const brief = `PIXEL CODE — RESUMO DO PROJETO\n\nNome: ${name}\nNegócio: ${byId('business').value.trim() || 'Não informado'}\nTipo de projeto: ${byId('kind').value}\n\nIDEIA\n${idea}\n\nDocumento preparado localmente. Não foi enviado à Pixel Code.\n`;
  const url = URL.createObjectURL(new Blob([brief], { type: 'text/plain;charset=utf-8' }));
  const link = document.createElement('a'); link.href = url; link.download = 'meu-projeto-pixel-code.txt';
  document.body.append(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  byId('status').textContent = 'Resumo preparado para download. Guarde o arquivo para compartilhar na conversa sobre seu projeto.';
});
