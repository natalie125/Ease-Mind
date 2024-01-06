import * as React from 'react';
import * as renderer from 'react-test-renderer';
import Webcam from 'react-webcam';

//webcam render test from https://github.com/mozmorris/react-webcam/blob/master/src/__tests__/react-webcam.test.tsx

//The test uses React's react-test-renderer to perform a snapshot test on a Webcam component from the react-webcam library.
//uses the renderer.create() method from react-test-renderer to render the Webcam component. Creates a test renderer instance, which can be used to generate a snapshot.
//Snapshot Testing: After rendering the component, the test uses expect(tree.toJSON()).toMatchSnapshot(); to generate a snapshot of the Webcam component's rendered output.
//If the current snapshot matches the stored snapshot, the test will pass, indicating that the rendered output of the component has not changed unexpectedly

it('renders correctly', () => {
  const tree = renderer
    .create(
      <Webcam
        audio={false}
        audioConstraints={{
          sampleSize: 8,
          echoCancellation: true
        }}
        className="react-webcam"
        imageSmoothing={false}
        minScreenshotHeight={1000}
        minScreenshotWidth={1000}
        onUserMedia={() => {}}
        onUserMediaError={() => {}}
        screenshotFormat="image/png"
        screenshotQuality={1}
        style={{transform: 'rotate(180deg)'}}
        videoConstraints={{
          width: 160,
          height: 120,
          frameRate: 15
        }}
        height={1000}
        width={1000}
      />
    )

  expect(tree.toJSON()).toMatchSnapshot();
});

//commenting the part for video testing
/*
it('sets <video/> muted to false when props.audio is true', () => {
  const tree = renderer
    .create(
      <Webcam
        audio={true}
        audioConstraints={{
          sampleSize: 8,
          echoCancellation: true
        }}
        className="react-webcam"
        imageSmoothing={false}
        minScreenshotHeight={1000}
        minScreenshotWidth={1000}
        onUserMedia={() => {}}
        onUserMediaError={() => {}}
        screenshotFormat="image/png"
        screenshotQuality={1}
        style={{transform: 'rotate(180deg)'}}
        videoConstraints={{
          width: 160,
          height: 120,
          frameRate: 15
        }}
        height={1000}
        width={1000}
      />
    )

  expect(tree.root.findByType('video').props.muted).toBe(false)
})

it('sets <video/> disablePictureInPicture to true when props.disablePictureInPicture is true', () => {
  const tree = renderer
    .create(
      <Webcam
        audio={false}
        audioConstraints={{
          sampleSize: 8,
          echoCancellation: true
        }}
        className="react-webcam"
        //disablePictureInPicture={true}
        imageSmoothing={false}
        minScreenshotHeight={1000}
        minScreenshotWidth={1000}
        onUserMedia={() => {}}
        onUserMediaError={() => {}}
        screenshotFormat="image/png"
        screenshotQuality={1}
        style={{transform: 'rotate(180deg)'}}
        videoConstraints={{
          width: 160,
          height: 120,
          frameRate: 15
        }}
        height={1000}
        width={1000}
      />
    )

  expect(tree.root.findByType('video').props.disablePictureInPicture).toBe(true)
})

 */

