import { Fragment } from "react";
import { motion } from "framer-motion";

export default function Clouds({children}) {

    return (<Fragment>
        {children}
        <motion.div className="cloud" animate={{ scale: 0.5 }}>hello</motion.div>
        <style jsx global>{`
            .cloud {
                position: absolute;
                top: 0;
                left: 0;
            }
        `}</style>
    </Fragment>)
}