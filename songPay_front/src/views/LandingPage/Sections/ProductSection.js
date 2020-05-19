import React from 'react';
// @material-ui/core components
import { makeStyles } from '@material-ui/core/styles';

// @material-ui/icons
import Chat from '@material-ui/icons/Chat';
import VerifiedUser from '@material-ui/icons/VerifiedUser';
import Fingerprint from '@material-ui/icons/Fingerprint';
// core components
import GridContainer from 'components/Grid/GridContainer.js';
import GridItem from 'components/Grid/GridItem.js';
import InfoArea from 'components/InfoArea/InfoArea.js';

import styles from 'assets/jss/material-kit-react/views/landingPageSections/productStyle.js';
import { isConstructorDeclaration } from 'typescript';

const useStyles = makeStyles(styles);

export default function ProductSection() {
  const classes = useStyles();
  return (
    <div className={classes.section}>
      <GridContainer justify='center'>
        <GridItem xs={12} sm={12} md={8}>
          <h2 className={classes.title}>매장 안내</h2>
          <h5 className={classes.description}>
            QR결제가 가능한 매장을 만나보세요!
          </h5>
        </GridItem>
      </GridContainer>
      <div>
        <GridContainer></GridContainer>
      </div>
    </div>
  );
}
