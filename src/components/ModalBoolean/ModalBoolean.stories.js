import React from 'react';
import { storiesOf } from '@storybook/react';

import ModalBoolean from './ModalBoolean';


storiesOf('ModalBoolean', module)
    .add('ModalBoolean', () =>{
      return <ModalBoolean />
    }
)
