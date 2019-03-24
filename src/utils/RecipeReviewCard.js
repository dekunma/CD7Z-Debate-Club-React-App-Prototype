import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import red from '@material-ui/core/colors/red';
import ForwardIcon from '@material-ui/icons/Forward';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Loading from './Loading'
import axios from 'axios'
import ButtonAppBar from './ButtonAppBar';
const styles = theme => ({
  card: {
    maxWidth: 400,
    margin:50,
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  actions: {
    display: 'flex',
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    backgroundColor: red[500],
  },
});

class RecipeReviewCard extends React.Component {
  constructor(props){
      super(props);
      this.goToArticle = this.goToArticle.bind(this);
      this.goToSite = this.goToSite.bind(this);
      this.state = {
        expanded  : false, 
        posts   :   [],
        loading :   false,
        dates   :   [],
        titles  :   [],
        authors :   [],
        links   :   [],
        excerpt :   [],
        
      };
  }

  getPosts(){
    const url = "http://www.7debate.club/wp-json/wp/v2/posts?per_page=30";
    this.setState({loading:true});
    axios.get(url)
    .then(
      res => {
        var titleArray  =  [];
        var dateArray   =  [];
        var authorArray =  [];
        var linkArray   =  [];
        var excerptArray=  [];
        var contentArray=  [];
        for(var i=0;i<res.data.length;i++){
          titleArray[i]       =   res.data[i].title.rendered;
          dateArray[i]        =   res.data[i].date;
          authorArray[i]      =   res.data[i].author;
          linkArray[i]        =   res.data[i].link;
          excerptArray[i]     =   res.data[i].excerpt;
          contentArray[i]     =   res.data[i].content;
        }
        this.setState({
          loading : false,
          posts   : res.data,
          dates   : dateArray,
          titles  : titleArray,
          authors : authorArray,
          links   : linkArray, 
          excerpt : excerptArray,
          content : contentArray,
        });        
        console.log('The posts are: '+this.state.posts)
      }
    )
  }

  getExcerpt(data){
      if(data==='')
        return 'No Excerpt for this post';
      else
        return data.substring(3,50)+'...';    
  }

  getContent(data){
    if(data==='')
      return 'No content for this post'
    else{
          var reg = /[\u4e00-\u9fa5]/g;
          var datas = data.match(reg);
          if(datas===''||datas===null){
            return 'No content for this post'
          }
          else
            return data = datas.join("");
    }
  }

  selectImg(data){
    const defaultURL = 'http://www.7debate.club/wp-content/uploads/2019/02/QQ图片20190204101337.jpg';
    if(data==='')
      return defaultURL;
    else{
      for(var i=2;i<data.length-1;i++){
        if(data.substring(i-2,i-1)==='s'&&data.substring(i-1,i)==='r'&&data.substring(i,i+1)==='c'){
           for(var ii=i+3;ii<data.length-4;ii++){
             if(data.substring(ii,ii+1)==='"'){ 
              return data.substring(i+3,ii)
             }
           }
        }
      }
      return defaultURL
    } 
  }

  goToArticle(value){
      window.open(this.state.links[value])
  }

  goToSite(){
    window.open('https://www.7debate.club')
  }

  handleExpandClick = () => {
    this.setState(state => ({ expanded: !state.expanded }));
  };
  
  componentWillMount(){
    this.getPosts();
  }

  render() {
    const { classes } = this.props;
    var postNumber = [];
    var chooseAvatar    = function(avatar){
    if (avatar===1)
      return("W.B");
    
    else if(avatar===2)
      return("Oci")
  }

  for(var i=0;i<this.state.posts.length;i++){
    postNumber[i]=i;
 }
  if(this.state.loading){
   return(
     <div>
        <Loading/>
     </div>
   )
 }
  else return (
      <div>
      <ButtonAppBar/>
      {postNumber.map(value => (
          <Card key = {value} className={classes.card}>
            <CardHeader
              avatar={
                <Avatar aria-label="Recipe" className={classes.avatar}>
                  {chooseAvatar(this.state.authors[value])}
                </Avatar>
              }
              action={
                <IconButton>
                  <MoreVertIcon />
                </IconButton>
              }
              title={this.state.titles[value]}
              subheader={this.state.dates[value]}
            />
            <CardMedia
              className={classes.media}
              image={this.selectImg(this.state.content[value].rendered)}
              title="Paella dish"
            />
            <CardContent>
              <Typography component = 'p'>
                  {this.getExcerpt(this.state.excerpt[value].rendered)}
              </Typography>
            </CardContent>
            <CardActions className={classes.actions} disableActionSpacing>
              <IconButton onClick ={this.goToArticle.bind(this,value)} aria-label="Read Original Article">
                <ForwardIcon ></ForwardIcon>
              </IconButton>
              <IconButton
                className={classnames(classes.expand, {
                  [classes.expandOpen]: this.state.expanded,
                })}
                onClick={this.handleExpandClick}
                aria-expanded={this.state.expanded}
                aria-label="Show more"
              >
                <ExpandMoreIcon />
              </IconButton>
            </CardActions>
            <Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
              <CardContent>
                  <Typography paragraph>
                      {this.getContent(this.state.content[value].rendered)}
                  </Typography>
              </CardContent>
            </Collapse>
          </Card>
      ))}
      </div>
    );
  }
}

RecipeReviewCard.propTypes = {
  classes: PropTypes.object.isRequired,
};

RecipeReviewCard.defaultProps = {
  title        :   'Title is Not Rendered Correctly',
  date         :   'Date is Not Rendered Correctly',
  avatarName   :   'N/A',
}

export default withStyles(styles)(RecipeReviewCard);