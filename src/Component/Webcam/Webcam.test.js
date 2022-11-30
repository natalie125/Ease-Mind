/**
 * @jest-environment jsdom
 */

import renderer from "react-test-renderer";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import Webcam from "../Webcam";

it("changes the class when hovered", () => {
	const component = renderer.create(<Webcam />);
	let tree = component.toJSON();
	expect(tree).toMatchSnapshot();
});
