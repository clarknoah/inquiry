import React from 'react';
import { storiesOf } from '@storybook/react';

import NodeEditor from './NodeEditor';


storiesOf('NodeEditor', module)
    .add('NodeEditor', () =>{
      return <NodeEditor />
    }
)
