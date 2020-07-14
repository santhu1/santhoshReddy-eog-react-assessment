import CardHeader from "@material-ui/core/CardHeader";
import { withStyles } from "@material-ui/core/styles";

const styles = theme => ({
  root: {
    background: theme.palette.primary.main
  },
  title: {
    color: "grey"
  }
});
export default withStyles(styles)(CardHeader);
