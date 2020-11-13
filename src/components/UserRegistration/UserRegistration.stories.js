import React from 'react';
import { storiesOf } from '@storybook/react';

import UserRegistration from './UserRegistration';


storiesOf('UserRegistration', module)
    .add('UserRegistration', () =>{
      return <UserRegistration />
    }
)
