const hello = () => console.log('hello!!!');
hello();

import { $, $$ } from '../js/modules/bling';
import autoComplete from '../js/modules/autocomplete';
import typeAhead from '../js/modules/typeAhead';
import ajaxHeart from '../js/modules/ajaxHeart';

autoComplete($('#address'), $('#latitude'), $('#longitude'));
typeAhead($('.search'));

$$('form.heart').on('submit', ajaxHeart);


