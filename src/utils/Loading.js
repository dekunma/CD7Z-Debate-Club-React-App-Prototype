import LinearProgress from '@material-ui/core/LinearProgress';
import ButtonAppBar from './ButtonAppBar';
import React from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    root: {
      ...theme.mixins.gutters(),
      margin:50,
      padding:100, 
    },
  });

class Loading extends React.Component{
    render(){
        const { classes } = this.props;
        return(
            <div>
                <ButtonAppBar/>
                <LinearProgress/>
                <Paper className={classes.root} elevation={1}>
                    <Typography variant="h5" component="h3">
                    Loading
                    </Typography>
                    <Typography component="p">
                    Please Wait For a Moment 
                    </Typography>
                </Paper>

            </div>
        )
    }
}

export default withStyles (styles)(Loading)