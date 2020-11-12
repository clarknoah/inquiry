import React from 'react';
import { storiesOf } from '@storybook/react';

import Signup from './Signup';


storiesOf('Signup', module)
    .add('Signup', () =>{
      return <Signup />
    }
)
