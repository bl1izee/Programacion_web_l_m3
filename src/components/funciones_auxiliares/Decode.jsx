export default function Decode(string) {
    const txt = document.createElement("textarea");
    txt.innerHTML = string;
    return txt.value; // Devolvemos solo el valor del texto
}