'use strict';

angular.module('gursoyVakfiAdmin.version', [
  'gursoyVakfiAdmin.version.interpolate-filter',
  'gursoyVakfiAdmin.version.version-directive'
])

.value('version', '0.1');
