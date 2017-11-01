import React from 'react';
import { Video, Transformation } from 'cloudinary-react';
import { Link } from 'react-router-dom';
import classnames from 'classnames';
import { Button, Card, Icon } from 'semantic-ui-react'
import styles from './Landing.css';

const LandingPage = () => {
  const videoContent = classnames(styles.overlay, {
    [styles.videoContent]: true,
  });
  return (
    <div>
      <div className={styles.topContainer}>
        <Video
          cloudName="jchen54"
          publicId="farmVideoEditedCroppedCompressed_vlebog"
          autoPlay={true}
          loop={true}
        />
        <div className={videoContent}>
          <h1 className={styles.logoName}>COLLECTIVE</h1>
          <h3 className={styles.city}>  COLUMBUS  </h3>
          <Link className={styles.topButton} to="/signup">GET FRESH PRODUCE FOR 50% LESS</Link>
        </div>
      </div>
      <div className={styles.middleContainer}>
        <div className={styles.middleHeaderContainer}>
          <h1 className={styles.middleHeader}>Steps to Eating Healthier</h1>
        </div>
        <Card.Group className={styles.process}>
          <Card className={styles.processCards}>
            <Card.Content className={styles.processCardContent}>
              <div className={styles.processCardContentIcon}>
                <Icon
                  name="add to cart"
                  size="massive"
                />
              </div>
              <h1>Select Package</h1>
              <div className={styles.processDescriptionContainer}>
                <Card.Description className={styles.processCardContentDescription}>
                  Choose what types of food you would like
                </Card.Description>
              </div>
            </Card.Content>
          </Card>
          <div className={styles.processCardContentIcon}>
            <Icon
              name="arrow right"
              size="huge"
            />
          </div>
          <Card className={styles.processCards}>
            <Card.Content className={styles.processCardContent}>
              <div className={styles.processCardContentIcon}>
                <Icon
                  name="users"
                  size="massive"
                />
              </div>
              <h1>Vote</h1>
              <div className={styles.processDescriptionContainer}>
                <Card.Description className={styles.processCardContentDescription}>
                  Make your voice heard by casting food ballots
                </Card.Description>
              </div>
            </Card.Content>
          </Card>
          <div className={styles.processCardContentIcon}>
            <Icon
              name="arrow right"
              size="huge"
            />
          </div>
          <Card className={styles.processCards}>
            <Card.Content className={styles.processCardContent}>
              <div className={styles.processCardContentIcon}>
                <Icon
                  name="payment"
                  size="massive"
                />
              </div>
              <h1>Pay</h1>
              <div className={styles.processDescriptionContainer}>
                <Card.Description className={styles.processCardContentDescription}>
                  Collectively pool resources to receive discounted prices
                </Card.Description>
              </div>
            </Card.Content>
          </Card>
          <div className={styles.processCardContentIcon}>
            <Icon
              name="arrow right"
              size="huge"
            />
          </div>
          <Card className={styles.processCards}>
            <Card.Content className={styles.processCardContent}>
              <div className={styles.processCardContentIcon}>
                <Icon
                  name="spoon"
                  size="massive"
                />
              </div>
              <h1>Pick Up and Enjoy</h1>
              <div className={styles.processDescriptionContainer}>
                <Card.Description className={styles.processCardContentDescription}>
                  Head to your group's designated location and enjoy
                </Card.Description>
              </div>
            </Card.Content>
          </Card>
        </Card.Group>
      </div>
    </div>
  );
};

export default LandingPage;
