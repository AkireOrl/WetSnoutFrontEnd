import "./Footer.css"


export const Footer = () => {
    return (
        <>
            <div className="grid-container">
                <div className="privacidad">
                    <a>Privacidad</a>
                </div>
                <div className="fotcenter">
                    <a>Terminos y codiciones</a>
                    <img height="100px" className="mobile" src="./WetSnout.png" alt="" />
                    <a>2024 Erika Orlando</a>
                </div>
                <div className="contacto">
                    <a>Contacto</a>
                </div>
            </div>
        </>
    )
}