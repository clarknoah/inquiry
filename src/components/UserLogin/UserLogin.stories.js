import React from 'react';
import { storiesOf } from '@storybook/react';

import UserLogin from './UserLogin';


storiesOf('UserLogin', module)
    .add('UserLogin', () =>{
      return <UserLogin />
    }
)
