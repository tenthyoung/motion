import { frame } from "../../frameloop"
import { motionValue } from "../../value"
import { svgEffect } from "../svg"

async function nextFrame() {
    return new Promise<void>((resolve) => {
        frame.postRender(() => resolve())
    })
}

describe("svgEffect", () => {
    it("sets SVG attributes and styles after svgEffect is applied", async () => {
        const element = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "rect"
        )

        // Create motion values
        const width = motionValue("100")
        const height = motionValue("200")
        const fill = motionValue("red")
        const stroke = motionValue("blue")

        // Apply svg effect
        svgEffect(element, {
            width,
            height,
            fill,
            stroke,
        })

        await nextFrame()

        // Verify attributes and styles are set
        expect(element.getAttribute("width")).toBe("100")
        expect(element.getAttribute("height")).toBe("200")
        expect(element.style.fill).toBe("red")
        expect(element.style.stroke).toBe("blue")
    })

    it("updates SVG attributes and styles when motion values change", async () => {
        const element = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "rect"
        )

        // Create motion values
        const width = motionValue("100")
        const fill = motionValue("red")

        // Apply svg effect
        svgEffect(element, {
            width,
            fill,
        })

        await nextFrame()

        // Verify initial attributes and styles
        expect(element.getAttribute("width")).toBe("100")
        expect(element.style.fill).toBe("red")

        // Change motion values
        width.set("200")
        fill.set("blue")

        // Updates should be scheduled for the next frame render
        // Attributes and styles should not have changed yet
        expect(element.getAttribute("width")).toBe("100")
        expect(element.style.fill).toBe("red")

        await nextFrame()

        // Verify attributes and styles are updated
        expect(element.getAttribute("width")).toBe("200")
        expect(element.style.fill).toBe("blue")
    })

    it("handles multiple SVG elements", async () => {
        // Create additional elements
        const element1 = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "rect"
        )
        const element2 = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "circle"
        )

        const width = motionValue("100")
        const fill = motionValue("red")

        svgEffect([element1, element2], {
            width,
            fill,
        })

        await nextFrame()

        expect(element1.getAttribute("width")).toBe("100")
        expect(element1.style.fill).toBe("red")
        expect(element2.getAttribute("width")).toBe("100")
        expect(element2.style.fill).toBe("red")

        width.set("200")
        fill.set("blue")

        await nextFrame()

        expect(element1.getAttribute("width")).toBe("200")
        expect(element1.style.fill).toBe("blue")
        expect(element2.getAttribute("width")).toBe("200")
        expect(element2.style.fill).toBe("blue")
    })

    it("returns cleanup function that stops updating SVG attributes and styles", async () => {
        const element = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "rect"
        )
        // Create motion values
        const width = motionValue("100")
        const fill = motionValue("red")

        // Apply svg effect and get cleanup function
        const cleanup = svgEffect(element, {
            width,
            fill,
        })

        await nextFrame()

        // Verify initial attributes and styles
        expect(element.getAttribute("width")).toBe("100")
        expect(element.style.fill).toBe("red")

        // Change values and verify update on next frame
        width.set("200")
        fill.set("blue")

        await nextFrame()

        // Verify update happened
        expect(element.getAttribute("width")).toBe("200")
        expect(element.style.fill).toBe("blue")

        // Call cleanup function
        cleanup()

        // Change values again
        width.set("300")
        fill.set("green")

        await nextFrame()

        // Verify attributes and styles didn't change after cleanup
        expect(element.getAttribute("width")).toBe("200")
        expect(element.style.fill).toBe("blue")
    })
})
