// El botón de arrepentimiento es obligatorio para vender online en
// Argentina (Resolución 424/2020): tiene que estar accesible desde la
// página de inicio, en un lugar visible y sin pedir registro previo.
// Por eso es un link directo a WhatsApp que cualquiera puede usar.
export const WHATSAPP_NUMBER = "5491122531821";

export const linkArrepentimiento = () => {
  const texto = encodeURIComponent(
    "Hola Kenypets, quiero arrepentirme de una compra. Mi número de pedido es:"
  );
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${texto}`;
};
