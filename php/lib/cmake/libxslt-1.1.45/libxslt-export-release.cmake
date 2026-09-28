#----------------------------------------------------------------
# Generated CMake target import file for configuration "Release".
#----------------------------------------------------------------

# Commands may need to know the format version.
set(CMAKE_IMPORT_FILE_VERSION 1)

# Import target "LibXslt::LibXslt" for configuration "Release"
set_property(TARGET LibXslt::LibXslt APPEND PROPERTY IMPORTED_CONFIGURATIONS RELEASE)
set_target_properties(LibXslt::LibXslt PROPERTIES
  IMPORTED_LOCATION_RELEASE "${_IMPORT_PREFIX}/lib/libxslt.so"
  IMPORTED_SONAME_RELEASE "libxslt.so"
  )

list(APPEND _cmake_import_check_targets LibXslt::LibXslt )
list(APPEND _cmake_import_check_files_for_LibXslt::LibXslt "${_IMPORT_PREFIX}/lib/libxslt.so" )

# Import target "LibXslt::LibExslt" for configuration "Release"
set_property(TARGET LibXslt::LibExslt APPEND PROPERTY IMPORTED_CONFIGURATIONS RELEASE)
set_target_properties(LibXslt::LibExslt PROPERTIES
  IMPORTED_LOCATION_RELEASE "${_IMPORT_PREFIX}/lib/libexslt.so"
  IMPORTED_SONAME_RELEASE "libexslt.so"
  )

list(APPEND _cmake_import_check_targets LibXslt::LibExslt )
list(APPEND _cmake_import_check_files_for_LibXslt::LibExslt "${_IMPORT_PREFIX}/lib/libexslt.so" )

# Import target "LibXslt::xsltproc" for configuration "Release"
set_property(TARGET LibXslt::xsltproc APPEND PROPERTY IMPORTED_CONFIGURATIONS RELEASE)
set_target_properties(LibXslt::xsltproc PROPERTIES
  IMPORTED_LOCATION_RELEASE "${_IMPORT_PREFIX}/bin/xsltproc"
  )

list(APPEND _cmake_import_check_targets LibXslt::xsltproc )
list(APPEND _cmake_import_check_files_for_LibXslt::xsltproc "${_IMPORT_PREFIX}/bin/xsltproc" )

# Commands beyond this point should not need to know the version.
set(CMAKE_IMPORT_FILE_VERSION)
