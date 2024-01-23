import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Dialog, Button, Tooltip, DialogContent, DialogTitle, Typography } from "@material-ui/core";
import HelpIcon from '@mui/icons-material/HelpOutline';

const useStyles = makeStyles((theme) => ({
	button: {
		margin: '10px'
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
			<Tooltip title="Help" arrow>
				<Button
					variant='outlined'
					color='secondary'
					startIcon={<HelpIcon />}
					onClick={handleClickOpen}
					className={classes.button}
				>
					Help
				</Button>
			</Tooltip>

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
						<Typography style={{ fontSize: "1rem" }}>
							hello this is something
						</Typography>
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

interface helpPopupProps {
	onClose: boolean
}

export default Help;
