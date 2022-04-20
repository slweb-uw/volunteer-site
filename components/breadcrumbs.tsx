import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Link from '@material-ui/core/Link';
import HomeIcon from '@material-ui/icons/Home';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';

const useStyles = makeStyles((theme) => ({
    main: {
        marginBottom: 40,
    },
    link: {
        display: 'flex',
    },
    icon: {
        width: 20,
        height: 20,
    },
}));

// This implementation makes the assumption that the breadcrumbs will be max 3 levels deep:
// home page, parent URL, and child page; should refactor if this no longer holds.
// Prop 'crumbs' is an array of the title names of each page
export default function IconBreadcrumbs(props: { crumbs: string[]; parentURL: string | undefined; }) {
    const classes = useStyles();

    return (
        <Breadcrumbs
            aria-label="breadcrumb"
            separator={<NavigateNextIcon fontSize="small" />}
            className={classes.main}>
        <Link
            color="inherit"
            href="/"
            className={classes.link}>
            <HomeIcon className={classes.icon} />
        </Link>
        { props.parentURL && // Only the parent is linked in the breadcrumbs; current page is static text
            <Link
                color="inherit"
                href={ props.parentURL }
                className={classes.link}>
                { props.crumbs[0] }
            </Link>
        }
        <Typography color="textPrimary" className={classes.link} style={{ fontFamily: "Encode Sans" }}>
            { props.crumbs.slice(-1)[0] }
        </Typography>
        </Breadcrumbs>
    );
}
