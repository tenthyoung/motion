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
            "circle"
        )

        // Create motion values
        const cx = motionValue("100")
        const cy = motionValue("200")
        const fill = motionValue("red")
        const stroke = motionValue("blue")

        // Apply svg effect
        svgEffect(element, {
            cx,
            cy,
            fill,
            stroke,
        })

        await nextFrame()

        // Verify attributes and styles are set
        expect(element.getAttribute("cx")).toBe("100")
        expect(element.getAttribute("cy")).toBe("200")
        expect(element.style.fill).toBe("red")
        expect(element.style.stroke).toBe("blue")
    })

    it("updates SVG attributes and styles when motion values change", async () => {
        const element = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "circle"
        )

        // Create motion values
        const cx = motionValue("100")
        const fill = motionValue("red")

        // Apply svg effect
        svgEffect(element, {
            cx,
            fill,
        })

        await nextFrame()

        // Verify initial attributes and styles
        expect(element.getAttribute("cx")).toBe("100")
        expect(element.style.fill).toBe("red")

        // Change motion values
        cx.set("200")
        fill.set("blue")

        // Updates should be scheduled for the next frame render
        // Attributes and styles should not have changed yet
        expect(element.getAttribute("cx")).toBe("100")
        expect(element.style.fill).toBe("red")

        await nextFrame()

        // Verify attributes and styles are updated
        expect(element.getAttribute("cx")).toBe("200")
        expect(element.style.fill).toBe("blue")
    })

    it("handles multiple SVG elements", async () => {
        // Create additional elements
        const element1 = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "circle"
        )
        const element2 = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "circle"
        )

        const cx = motionValue("100")
        const fill = motionValue("red")

        svgEffect([element1, element2], {
            cx,
            fill,
        })

        await nextFrame()

        expect(element1.getAttribute("cx")).toBe("100")
        expect(element1.style.fill).toBe("red")
        expect(element2.getAttribute("cx")).toBe("100")
        expect(element2.style.fill).toBe("red")

        cx.set("200")
        fill.set("blue")

        await nextFrame()

        expect(element1.getAttribute("cx")).toBe("200")
        expect(element1.style.fill).toBe("blue")
        expect(element2.getAttribute("cx")).toBe("200")
        expect(element2.style.fill).toBe("blue")
    })

    it("returns cleanup function that stops updating SVG attributes and styles", async () => {
        const element = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "circle"
        )
        // Create motion values
        const cx = motionValue("100")
        const fill = motionValue("red")

        // Apply svg effect and get cleanup function
        const cleanup = svgEffect(element, {
            cx,
            fill,
        })

        await nextFrame()

        // Verify initial attributes and styles
        expect(element.getAttribute("cx")).toBe("100")
        expect(element.style.fill).toBe("red")

        // Change values and verify update on next frame
        cx.set("200")
        fill.set("blue")

        await nextFrame()

        // Verify update happened
        expect(element.getAttribute("cx")).toBe("200")
        expect(element.style.fill).toBe("blue")

        // Call cleanup function
        cleanup()

        // Change values again
        cx.set("300")
        fill.set("green")

        await nextFrame()

        // Verify attributes and styles didn't change after cleanup
        expect(element.getAttribute("cx")).toBe("200")
        expect(element.style.fill).toBe("blue")
    })

    it("handles both camelCase and kebab-case style properties", async () => {
        const element = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "circle"
        )

        // Create motion values for both camelCase and kebab-case
        const transformBox = motionValue("fill-box")
        const transformOrigin = motionValue("center")

        // Apply svg effect
        svgEffect(element, {
            transformBox,
            "transform-origin": transformOrigin,
        })

        await nextFrame()

        // Verify both properties are set via style
        expect(element.style.transformBox).toBe("fill-box")
        expect(element.style.transformOrigin).toBe("center")

        // Update values
        transformBox.set("view-box")
        transformOrigin.set("top left")

        await nextFrame()

        // Verify updates are applied via style
        expect(element.style.transformBox).toBe("view-box")
        expect(element.style.transformOrigin).toBe("top left")
    })
})
