export default function Boton({value, cambiarEstado, acierto}){
    let valor = value;

    function responder(valor){
        if(valor === "Iniciar" || valor === "Reiniciar"){
            cambiarEstado("esperar");
        }
        else{
            if(valor === "True" && acierto === true){
                cambiarEstado("acierto");
            }
            else if(valor === "False" && acierto === false){
                cambiarEstado("acierto");
            }
            else{
                cambiarEstado("fallo");
            }
        }
    }

    return (
        <button onClick={() => responder(valor)}>{valor}</button>
    );
}