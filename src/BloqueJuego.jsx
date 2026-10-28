import { useEffect, useRef, useState, useCallback } from "react";
import Stats from "./components/Stats";
import Pregunta from "./components/Pregunta"
import Boton from "./components/Boton";
import Api from "./components/funciones_auxiliares/Api";
import NumeroPregunta from "./components/NumeroPregunta";
import Decode from "./components/funciones_auxiliares/Decode";

export default function BloqueJuego(){
    const [numPregunta, setNumPregunta] = useState(0); // Usamos un useSate para guardar el valor del numero de la pregunta por el que va el juego
    const [estadoJuego, setEstadoJuego] = useState("parado"); // Usamos un useStae para que se renderice por cada fase/estado del juego

    const preguntas = useRef([]); // Usamos un useRef ya que al obtener las preguntas, no queremos que se recarge la página, eso ya se controla en el useEffect de los estados del juego

    useEffect(() => {
        // Cuando cambie el estado a esperar, se devolverá la pantalla de caragndo respuesta y después, se ejecutará el useEffect y cargará las respuestas de la API
        if (estadoJuego === "esperar") {
            async function cargarPreguntas() {
                try{
                    preguntas.current = await Api();
                } catch (error){
                    preguntas.current = {error:"Error al cargar la api"};
                    setEstadoJuego("error");
                }

                console.log(preguntas.current);

                if(Object.keys(preguntas.current).length === 1){
                    setEstadoJuego("error");
                }
                else{
                    setEstadoJuego("iniciar");
                }

                setNumPregunta(0); // Reiniciamos el numero de preguntas por si ha reiniciado el juego
            }

            cargarPreguntas();
        }
    }, [estadoJuego]); // Se ejecuta solo al montar al cambiar el estado de estadoJuego

    function responder(valor){
        if(valor === "Iniciar" || valor === "Reiniciar"){
            setEstadoJuego("esperar");
        }
        else{ 
            // Caso de que el usuario acierte
            if((valor === "True" && preguntas.current[numPregunta].correcta === true) || 
            (valor === "False" && preguntas.current[numPregunta].correcta === false)){
                if (numPregunta === preguntas.current.length - 1){
                    setEstadoJuego("ganar")
                }
                else{
                    setNumPregunta(numPregunta + 1);
                    setEstadoJuego("iniciar");
                }
            }
            // Caso de que el usuario falle
            else{
                setEstadoJuego("fallo");
            }
        }
    }

    if(estadoJuego === "parado"){ 
        return(
            <>
                <Pregunta texto={"Iniciar juego"}></Pregunta>
                <Boton value={"Iniciar"} cambiarEstado={setEstadoJuego} funcionResponder={responder}></Boton> {/* Botón de iniciar el juego */}
            </>
        );
    }
    else if(estadoJuego === "esperar"){
        return(
            <Pregunta texto={"Consultado a la API..."}></Pregunta>
        );
    } 
    else if(estadoJuego === "iniciar"){
        // Transformamos la pregunta para quitar el formato HTML a formato normal string
        const pregunta = Decode(preguntas.current[numPregunta].texto);

        return(
            <>
                <Stats dificultad={preguntas.current[numPregunta].dificultad} tema={preguntas.current[numPregunta].categoria}></Stats>
                <NumeroPregunta numPregunta={numPregunta + 1}></NumeroPregunta>
                <Pregunta texto={pregunta}></Pregunta>
                <Boton value={"True"} cambiarEstado={setEstadoJuego} funcionResponder={responder}></Boton> {/* Botón True */}
                <Boton value={"False"} cambiarEstado={setEstadoJuego} funcionResponder={responder}></Boton> {/* Botón False */}
            </>
        )
    }
    else if(estadoJuego === "error"){
        return(
            <>
                <Pregunta texto={preguntas.current.error}></Pregunta>
                <Boton value={"Reiniciar"} cambiarEstado={setEstadoJuego} funcionResponder={responder}></Boton> {/* Botón de reiniciar */}
            </>
        )
    }
    else if(estadoJuego === "fallo"){
        return(
            <>
                <Pregunta texto={"No conseguiste salvarlos. ¡El mal ha ganado!"}></Pregunta>
                <Boton value={"Reiniciar"} cambiarEstado={setEstadoJuego} funcionResponder={responder}></Boton> {/* Botón de reiniciar */}
            </>
        )
    }
    else if(estadoJuego === "ganar"){
        return(
            <>
                <Pregunta texto={"¡Has ganado! Has derrotado al mal, sabio caballero."}></Pregunta>
                <Boton value={"Reiniciar"} cambiarEstado={setEstadoJuego} funcionResponder={responder}></Boton> {/* Botón de reiniciar */}
            </>
        )
    }
}