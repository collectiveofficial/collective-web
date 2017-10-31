import React from 'react';
import { Video, Transformation } from 'cloudinary-react';
import { Link } from 'react-router-dom';
import classnames from 'classnames';
import HeaderContainer from '../header/containers/HeaderContainer.js';
import styles from './Landing.css';

const LandingPage = () => {
  const videoContent = classnames(styles.overlay, {
    [styles.videoContent]: true,
  });
  return (
    <div>
      <HeaderContainer />
      <div className={styles.topContainer}>
        <Video
          cloudName="jchen54"
          publicId="farmVideoEditedCroppedCompressed_vlebog"
          autoPlay={true}
          loop={true}
        >
          <Transformation
            crop="scale"
            audio_codec="none"
          />
        </Video>
        <div className={videoContent}>
          <h1 className={styles.logoName}>COLLECTIVE</h1>
          <h3 className={styles.city}>  COLUMBUS  </h3>
          <Link className={styles.topButton} to="/signup">GET FRESH PRODUCE FOR 50% LESS</Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
