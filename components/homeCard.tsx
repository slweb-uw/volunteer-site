import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";

interface Props {
    links: [String]
  }
const HomeCard: React.FC<Props> = (props) => {
return (
    <Card
        variant="outlined"
        style={{ borderRadius: 10 }}>
        <CardMedia src="/aboutUs.png" style={{height: 100}}></CardMedia>
        <CardContent>
            <Typography>Hello</Typography>
        </CardContent>
    </Card>

)
}


export default HomeCard;