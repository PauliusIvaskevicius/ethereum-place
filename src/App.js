import React, { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import Grid from "./components/Grid";
import Draggable from "react-draggable";
import {  Button } from "web3uikit";
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, ModalFooter, Text, Link} from "@chakra-ui/react";
import { ExternalLinkIcon } from '@chakra-ui/icons'

function App() {
	const { isAuthenticated, Moralis, authenticate, isInitialized } = useMoralis();
	const [showModal, showInfoModal] = useState(false);
	const [isDragging, setIsDragging] = useState(false);

	const nodeRef = React.useRef(null);

	useEffect(() => {
		document.body.style.overflow = "hidden";
		document.body.style.margin = 0;
	}, []);

	const onDrag = (e) => {
		if (e.type === "mousemove" || e.type === "touchmove") {
			if (!isDragging) {
				setIsDragging(true);
			}
		}
	};

	const onStopDrag = () => {
		setTimeout(() => {
			setIsDragging(false);
		}, 100);
	};

	return (
		<div
			style={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				height: "100vh",
				backgroundColor: "#D3D3D3",
			}}
		>
			{isInitialized ? (
				<div>
					{isAuthenticated ? (
						<div>
							<Draggable nodeRef={nodeRef} onDrag={onDrag} onStop={onStopDrag}>
								<div ref={nodeRef}>
									{" "}
									<Grid isDragging={isDragging} />{" "}
								</div>
							</Draggable>
							<div
								style={{
									position: "absolute",
									top: "1em",
									right: "1em",
									display: "inline-flex",
									gap: "0.5em",
								}}
							>
								<Button
									color="red"
									icon="logOut"
									iconLayout="trailing"
									id=""
									onClick={() =>
										Moralis.User.logOut().then(() => {
											window.location.reload();
										})
									}
									radius={20}
									text="Log out"
									theme="colored"
									type="button"
								/>

								<Button
									color="blue"
									icon="info"
									iconLayout="icon-only"
									id=""
									onClick={() => showInfoModal(!showModal)}
									radius={20}
									theme="colored"
									type="button"
								/>
							</div>
							{showModal ? (
								<Modal closeOnOverlayClick={false} isOpen={showModal} onClose={() => showInfoModal(false)}>
									<ModalOverlay />
									<ModalContent>
										<ModalHeader>About</ModalHeader>
										<ModalCloseButton />
										<ModalBody pb={6}>
											<Text>This website was created by <Link href="https://twitter.com/codemaxwell" isExternal>@codemaxwell. <ExternalLinkIcon mx='2px' /></Link></Text>
											<br />
											<Text>ETH Place replicates the behaviour of the famous  <Link href="https://www.reddit.com/r/place" isExternal>/r/place. <ExternalLinkIcon mx='2px' /></Link> concept.</Text>
											<br />
											<Text>This website uses ethereum smart contracts to store and manipulate data.</Text>
											<br />
											<Text>Frontend of this site was made with react and moralis.</Text>
											<br />
											<Text>This implementation supports canvas size of 100x100. Larger canvas size would require the use of WebGL for rendering and modified smart contract to support fetching of larger data structure.</Text>
										</ModalBody>
										<ModalFooter />
									</ModalContent>
								</Modal>
							) : (
								<div></div>
							)}
						</div>
					) : (
						<div>
							<Button
								icon="eth"
								iconLayout="trailing"
								id=""
								onClick={() => authenticate()}
								size="large"
								text="Connect"
								theme="primary"
								type="button"
							/>
						</div>
					)}
				</div>
			) : (
				<div></div>
			)}
		</div>
	);
}

export default App;
