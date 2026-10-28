export default function Boton({value, funcionResponder}){
    let valor = value;

    return (
        <button key={valor} onClick={() => funcionResponder(valor)}>{valor}</button>
    );
}