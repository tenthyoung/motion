import { motion, scroll, useMotionValue, useTransform } from "framer-motion"
import * as React from "react"
import { useEffect } from "react"

export const App = () => {
    const position = useMotionValue(0)
    const velocity = useMotionValue(0)

    useEffect(() => {
        return scroll((_progress, info) => {
            position.set(info.y.progress)
            velocity.set(info.y.velocity)
        })
    }, [])

    const positionDisplay = useTransform(() =>
        Math.max(position.get(), position.getPrevious() ?? 0)
    )
    const velocityDisplay = useTransform(() =>
        Math.round(Math.max(velocity.get(), velocity.getPrevious() ?? 0))
    )

    return (
        <>
            <div style={{ ...spacer, backgroundColor: "red" }} />
            <div style={{ ...spacer, backgroundColor: "green" }} />
            <div style={{ ...spacer, backgroundColor: "blue" }} />
            <div style={{ ...spacer, backgroundColor: "yellow" }} />
            <motion.div id="color" style={progressStyle}>
                {positionDisplay}
            </motion.div>
            <motion.div id="color" style={progressStyle}>
                {velocityDisplay}
            </motion.div>
        </>
    )
}

const spacer = {
    height: "100vh",
}

const progressStyle: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    width: 100,
    height: 100,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: 80,
    lineHeight: 80,
    fontWeight: "bold",
}
