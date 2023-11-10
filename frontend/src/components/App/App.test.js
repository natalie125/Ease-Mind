/**
 * @jest-environment jsdom
 */

// import renderer from "react-test-renderer";
// import App from "./App";

// test("renders the landing page", () => {
// 	const component = renderer.create(<App />);
// });

describe("Addition", () => {
	it("knows that 2 and 2 make 4", () => {
		expect(2 + 2).toBe(4);
	});
});
