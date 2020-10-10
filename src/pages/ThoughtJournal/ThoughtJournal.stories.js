import React from 'react';
import { storiesOf } from '@storybook/react';

import ThoughtJournal from './ThoughtJournal';


storiesOf('ThoughtJournal', module)
    .add('ThoughtJournal', () =>{
      return <ThoughtJournal />
    }
)
