import React from 'react';
import { storiesOf } from '@storybook/react';

import WhenNotBelieved from './WhenNotBelieved';


storiesOf('WhenNotBelieved', module)
    .add('WhenNotBelieved', () =>{
      return <WhenNotBelieved />
    }
)
