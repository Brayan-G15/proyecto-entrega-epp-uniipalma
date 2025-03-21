import React, { useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { format } from "date-fns";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const BuscarTrabajadorEPP = () => {
    const [cedula, setCedula] = useState("");
    const [trabajador, setTrabajador] = useState(null);
    const [entregas, setEntregas] = useState([]);

    // Función para buscar al trabajador y sus entregas
    const handleBuscarTrabajador = async () => {
        try {
            // Buscar al trabajador por cédula
            const responseTrabajador = await fetch(
                `http://localhost:4000/api/epp/buscar-trabajador/${cedula}`
            );
            const dataTrabajador = await responseTrabajador.json();
            console.log("Datos del trabajador:", dataTrabajador); // Depuración

            if (dataTrabajador.success) {
                setTrabajador(dataTrabajador.trabajador);

                // Buscar las entregas relacionadas al trabajador
                const responseEntregas = await fetch(
                    `http://localhost:4000/api/epp/entregas-por-trabajador/${dataTrabajador.trabajador._id}`
                );
                const dataEntregas = await responseEntregas.json();

                if (dataEntregas.success) {
                    setEntregas(dataEntregas.entregas);
                } else {
                    Swal.fire("Error", "No se encontraron entregas para este trabajador", "error");
                }
            } else {
                Swal.fire("Error", "Trabajador no encontrado", "error");
            }
        } catch (error) {
            console.error("Error al buscar el trabajador:", error);
            Swal.fire("Error", "Hubo un problema al buscar el trabajador", "error");
        }
        console.log("Datos de las entregas:", entregas);
    };

    // Funcion para descargar la tabla PDF
    const handleDescargarPDF = () => {
        if (!trabajador || entregas.length === 0) {
            Swal.fire("Error", "No hay datos para descargar", "error");
            return;
        }
    
        // Ocultar la barra de búsqueda y otros elementos no deseados
        const searchBar = document.querySelector(".epp-search");
        const title = document.querySelector(".epp-title");
        const buttons = document.querySelectorAll(".epp-button");

        if (searchBar) searchBar.style.display = "none"; // Ocultar la barra de búsqueda
        if (title) title.style.display = "none"; // Ocultar el título
        buttons.forEach((button) => {
            button.style.display = "none"; // Ocultar los botones
    });
    
        // Crear un nuevo elemento para el encabezado personalizado
        const header = document.createElement("div");
        header.innerHTML = `
            <h1 style="text-align: center; font-size: 24px; margin-bottom: 20px;">COMPROBANTES DE ENTREGAS EPP UNIPALMA</h1>
        `;
        header.style.textAlign = "center";
        header.style.marginBottom = "20px";
    
        // Insertar el encabezado antes de la tabla
        const container = document.querySelector(".epp-container");
        if (container) {
            container.insertBefore(header, container.firstChild); // Agregar el encabezado al inicio
        }
    
        // Capturar el contenido del contenedor
        html2canvas(container).then((canvas) => {
            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF("p", "mm", "a4"); // Orientación portrait, unidades en mm, tamaño A4
    
            // Tamaño de la imagen en el PDF
            const imgWidth = 210; // Ancho de A4 en mm
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
            // Agregar la imagen al PDF
            pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
    
            // Descargar el PDF
            pdf.save(`comprobante_entregas_epp_${trabajador.cedula}.pdf`);
    
            // Restaurar los elementos ocultos después de la descarga
            if (searchBar) searchBar.style.display = "block"; // Restaurar la barra de búsqueda
            if (title) title.style.display = "block"; // Restaurar el título
            buttons.forEach((button) => {
                button.style.display = "block"; // Restaurar visibilidad de los botones
            });
    
            // Eliminar el encabezado personalizado
            if (header && container) {
                container.removeChild(header);
            }
        });

    // // Ocultar elementos no deseados temporalmente
    // const searchBar = document.querySelector(".epp-search");
    // const title = document.querySelector(".epp-title");
    // const buttons = document.querySelectorAll(".epp-button");

    // if (searchBar) searchBar.style.display = "none"; // Ocultar la barra de búsqueda
    // if (title) title.style.display = "none"; // Ocultar el título
    // buttons.forEach((button) => {
    //     button.style.display = "none"; // Ocultar los botones
    // });

    // // Crear un nuevo elemento para el encabezado personalizado
    // const header = document.createElement("div");
    // header.innerHTML = `
    //     <h1 style="text-align: center; font-size: 24px; margin-bottom: 20px;">COMPROBANTES DE ENTREGAS EPP UNIPALMA</h1>
    // `;
    // header.style.textAlign = "center";
    // header.style.marginBottom = "20px";

    // // Insertar el encabezado antes de la tabla
    // const container = document.querySelector(".epp-container");
    // if (container) {
    //     container.insertBefore(header, container.firstChild); // Agregar el encabezado al inicio
    // }

    // // Capturar el contenido del contenedor
    // html2canvas(container).then((canvas) => {
    //     const imgData = canvas.toDataURL("image/png");
    //     const pdf = new jsPDF("p", "mm", "a4"); // Orientación portrait, unidades en mm, tamaño A4

    //     // Tamaño de la imagen en el PDF
    //     const imgWidth = 210; // Ancho de A4 en mm
    //     const imgHeight = (canvas.height * imgWidth) / canvas.width;

    //     // Agregar la imagen al PDF
    //     pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);

    //     // Descargar el PDF
    //     pdf.save(`comprobante_entregas_epp_${trabajador.cedula}.pdf`);

    //     // Restaurar los elementos ocultos después de la descarga
    //     if (searchBar) searchBar.style.display = "block"; // Restaurar la barra de búsqueda
    //     if (title) title.style.display = "block"; // Restaurar el título
    //     buttons.forEach((button) => {
    //         button.style.display = "block"; // Restaurar visibilidad de los botones
    //     });

    //     // Eliminar el encabezado personalizado
    //     if (header && container) {
    //         container.removeChild(header);
    //     }
    // });
};

    // Funcion para descargar tabla en archivo CSV
    const handleDescargarTabla = () => {
        if (!trabajador || entregas.length === 0) {
            Swal.fire("Error", "No hay datos para descargar", "error");
            return;
        }

        let csvContent = "data:text/csv;charset=utf-8,";
        const headers = [
            "Nombre",
            "Apellido",
            "Cédula",
            "centro_de_operacion",
            "cargo",
            "contacto",
            "Fecha de Entrega",
            "EPP Entregado",
            "Empresa",
            "Referencia/Tipo",
            "Nombre Quien Entrega",
            "Tarea/Labor",
        ];
        csvContent += headers.join(",") + "\n";

        entregas.forEach((entrega) => {
            const fechaValida = new Date(entrega.fecha_entrega);
            const fechaFormateada = isNaN(fechaValida) ? "Fecha inválida" : format(fechaValida, "dd/MM/yyyy");

            const row = [
                trabajador.nombre,
                trabajador.apellido,
                trabajador.cedula,
                trabajador.centro_de_operacion,
                trabajador.cargo,
                trabajador.empresa,
                trabajador.contacto,
                fechaFormateada,
                entrega.epp_entregado,
                entrega.referencia_tipo,
                entrega.nombre_hs_entrega,
                entrega.tarea_labor,
            ];
            csvContent += row.join(",") + "\n";
        });

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `entregas_${trabajador.cedula}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };


    return (
        <div className="body-epp">
            {/* Menú de navegación */}
            <nav className="nav-registro">
                <div className="hamburger-registro" id="hamburger-registro">
                    <div className="line line1"></div>
                    <div className="line line2"></div>
                </div>
                <ul id="menu" className="menu">
                    <li>
                        <Link to="/home" className="nav-link-registro">
                            Inicio
                        </Link>
                    </li>
                    <li>
                        <Link to="/" className="nav-link-registro">
                            Cerrar Sesión
                        </Link>
                    </li>
                </ul>
            </nav>

            {/* Contenedor principal */}
            <div className="epp-container">
                <h1 className="epp-title hidden-for-pdf">Buscar Trabajador y Entregas de EPP</h1>

                {/* Búsqueda por cédula */}
                <div className="epp-search">
                    <input
                        type="text"
                        id="epp-cedula"
                        className="epp-input"
                        placeholder="Ingrese la cédula"
                        value={cedula}
                        onChange={(e) => setCedula(e.target.value)}
                    />
                    <button id="epp-buscar" className="epp-button" onClick={handleBuscarTrabajador}>
                        Buscar
                    </button>
                </div>

                {/* Información del trabajador */}
                {trabajador && (
                    <table id="epp-datos-trabajador" className="epp-datos epp-table epp-worker-info">
                        <tr className="epp-dato">
                        <td className="epp-td"> <strong>Nombre del trabajador:</strong> <span className="epp-input" id="epp-nombre">{trabajador.nombre } {trabajador.apellido}</span></td>
                        </tr>
                        {/* <div className="epp-dato">
                            <strong>Apellido:</strong>{" "}
                            <span id="epp-apellido">{trabajador.apellido}</span>
                        </div> */}
                        <div className="epp-dato">
                            <strong>Cédula:</strong>{" "}
                            <span id="epp-cedula-trabajador">{trabajador.cedula}</span>
                        </div>
                        <div className="epp-dato">
                            <strong>Centro de operacion:</strong> <span id="epp-area">{trabajador.centro_de_operacion}</span>
                        </div>
                        <div className="epp-dato">
                            <strong>Cargo:</strong>{" "}
                            <span id="epp-labor-trabajador">{trabajador.cargo}</span>
                        </div>
                        <div className="epp-dato">
                            <strong>Empresa:</strong>{" "}
                            <span id="epp-labor-trabajador">{trabajador.empresa}</span>
                        </div>
                        <div className="epp-dato">
                            <strong>Contacto:</strong>{" "}
                            <span id="epp-labor-trabajador">{trabajador.contacto}</span>
                        </div>
                    </table>
                )}

                {/* Tabla de entregas */}
                {entregas.length > 0 && (
                    <div>
                        <button className="epp-button hidden-for-pdff" onClick={handleDescargarPDF}>
                            Descargar PDF
                        </button>
                        <button className="epp-button hidden-for-pdff" onClick={handleDescargarTabla}>
                             Descargar Tabla
                        </button>
                        <table className="epp-table epp-delivery-table">
                            <thead>
                                <tr>
                                    <th className="epp-th">ITEM</th>
                                    <th className="epp-th">FECHA</th>
                                    <th className="epp-th">EPP ENTREGADO</th>
                                    <th className="epp-th">REFERENCIA/TIPO</th>
                                    <th className="epp-th">NOMBRE QUIEN ENTREGA</th>
                                    <th className="epp-th">TAREA/LABOR</th>
                                    <th className="epp-th">HUELLA DIGITAL</th>
                                </tr>
                            </thead>
                            <ul className="epp-lista-entregas">
                                {entregas.map((entrega, index) => {
                                    // Validar que la fecha sea válida
                                    const fechaValida = new Date(entrega.fecha_entrega);
                                    const fechaFormateada = isNaN(fechaValida) ? "Fecha inválida" : format(fechaValida, "dd/MM/yyyy");

                                    return (
                                        <li key={entrega._id} className="epp-item-entrega">
                                            <div className="epp-item-header">
                                                <strong>Entrega #{index + 1}</strong>
                                            </div>
                                            <div className="epp-item-details">
                                                <p><strong>Fecha:</strong> {fechaFormateada}</p>
                                                <p><strong>EPP Entregado:</strong> {entrega.epp_entregado}</p>
                                                <p><strong>Referencia/Tipo:</strong> {entrega.referencia_tipo}</p>
                                                <p><strong>Nombre Quien Entrega:</strong> {entrega.nombre_hs_entrega}</p>
                                                <p><strong>Tarea/Labor:</strong> {entrega.tarea_labor}</p>
                                                <p><strong>Firma:</strong> 
                                                <img
                                                        src={entrega.firma}
                                                        alt="Firma del trabajador"
                                                        style={{ width: "200px", height: "150px", border: "1px solid #000" }}
                                                    />
                                                </p>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BuscarTrabajadorEPP;