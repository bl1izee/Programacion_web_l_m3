export default async function Api(){
    const respuesta = await fetch("https://opentdb.com/api.php?amount=5&type=boolean");

    if (!respuesta.ok) {
        return {error:"Error al consultar la API"};
    }

    const datos = await respuesta.json();

    // Transformamos el formato de la API al formato de nuestro juego.
    return datos.results.map(pregunta => ({
        texto: pregunta.question,
        correcta: pregunta.correct_answer === "True", // Lo convierte a bool el dato
        categoria: pregunta.category,
        dificultad: pregunta.difficulty
    }));
}