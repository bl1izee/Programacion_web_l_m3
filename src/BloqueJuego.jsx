import { useEffect, useRef, useState } from "react";
import Stats from "./components/Stats";
import Pregunta from "./components/Pregunta"
import Boton from "./components/Boton";
import newQuestion from "./components/funciones_auxiliares/Api";
import NumeroPregunta from "./components/NumeroPregunta";

export default function BloqueJuego(){
    const [numPregunta, setNumPregunta] = useState(0); // Usamos un useSate para guardar el valor del numero de la pregunta por el que va el juego
    const [estadoJuego, setEstadoJuego] = useState("parado"); // Usamos un useStae para que se renderice por cada fase/estado del juego

    const preguntas = useRef({}); // Usamos un useRef ya que no quiero que se renderize al obtener los datos, para esto está el useEffect

    useEffect(() => {
        // Configuramos el evento de llamar a la api solo cuando esté esperando al usuario a que carge la api
        if (estadoJuego === "esperar") {
            async function cargarPreguntas() {
                preguntas.current = await newQuestion();

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
        else if (estadoJuego === "acierto") {
            if (numPregunta === preguntas.current.length - 1){
                setEstadoJuego("ganar")
            }
            else{
                setNumPregunta(numPregunta + 1);
                setEstadoJuego("iniciar");
            }
        } 
        
    }, [estadoJuego]); // Se ejecuta solo al montar al cambiar el estado de estadoJuego

    if(estadoJuego === "parado"){ 
        return(
            <>
                <Pregunta texto={"Iniciar juego"}></Pregunta>
                <Boton value={"Iniciar"} cambiarEstado={setEstadoJuego}></Boton> {/* Botón de reiniciar */}
            </>
        );
    }
    else if(estadoJuego === "esperar"){
        return(
            <Pregunta texto={"Consultado a la API..."}></Pregunta>
        );
    } 
    else if(estadoJuego === "iniciar"){
        return(
            <>
                <Stats dificultad={preguntas.current[numPregunta].dificultad} tema={preguntas.current[numPregunta].categoria}></Stats>
                <NumeroPregunta numPregunta={numPregunta + 1}></NumeroPregunta>
                <Pregunta texto={preguntas.current[numPregunta].texto}></Pregunta>
                <Boton value={"True"} cambiarEstado={setEstadoJuego} acierto={preguntas.current[numPregunta].correcta}></Boton> {/* Botón True */}
                <Boton value={"False"} cambiarEstado={setEstadoJuego} acierto={preguntas.current[numPregunta].correcta}></Boton> {/* Botón False */}
            </>
        )
    }
    else if(estadoJuego === "error"){
        return(
            <>
                <Pregunta texto={preguntas.current.error}></Pregunta>
                <Boton value={"Reiniciar"} cambiarEstado={setEstadoJuego}></Boton> {/* Botón de reiniciar */}
            </>
        )
    }
    else if(estadoJuego === "fallo"){
        return(
            <>
                <Pregunta texto={"No conseguiste salvarlos. ¡El mal ha ganado!"}></Pregunta>
                <Boton value={"Reiniciar"} cambiarEstado={setEstadoJuego}></Boton> {/* Botón de reiniciar */}
            </>
        )
    }
    else if(estadoJuego === "ganar"){
        return(
            <>
                <Pregunta texto={"¡Has ganado! Has derrotado al mal, sabio caballero."}></Pregunta>
                <Boton value={"Reiniciar"} cambiarEstado={setEstadoJuego}></Boton> {/* Botón de reiniciar */}
            </>
        )
    }
}