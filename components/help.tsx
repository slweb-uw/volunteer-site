import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Dialog, Button, DialogContent, DialogTitle, Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
	div: {
		width: '100%',
		justifyContent: 'flex-end',
		display: 'flex'
	}
}));

const Help: React.FC<{}> = () => {
	const [open, setOpen] = useState(false);
	const classes = useStyles();

	const handleClose = () => {
		setOpen(false);
	}

	const handleClickOpen = () => {
		setOpen(true);
	}
	
	return (
		<>
			<div className={classes.div}>
				<Button variant="outlined" color="primary" onClick={handleClickOpen}>
					?
				</Button>
			</div>
			<Dialog
				open={open}
				onClose={handleClose}
				aria-labelledby="Help Menu"
				aria-describedby="Directions for how to use this site"
			>
				<DialogTitle>How to use this site</DialogTitle>
				<DialogContent>
					<Typography
						style={{
							fontSize: "1rem",
							fontWeight: 300,
							fontFamily: "Encode Sans",
							textTransform: "uppercase"
						}}
					>
						Volunteers	
					</Typography>
					<Typography
						style={{
							fontSize: "1rem",
							fontWeight: 300,
							fontFamily: "Encode Sans",
							textTransform: "uppercase"
						}}
					>
						Providers	
					</Typography>
				</DialogContent>
			</Dialog>
		</>
	);
}

interface helpPopupProps  {
	onClose: boolean	
}

export default Help;
