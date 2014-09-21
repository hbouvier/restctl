#!/bin/sh

get() {
	test_name=$1;shift
	path=$1;shift
	expected_code=$1;shift
	expected_output=$1;shift
	
	output=$(restctl get "$path")
	code=$?
	if [ "$code" != "$expected_code" ] ; then
		printf "[FAILED] $test_name ... expecting exit code to be $expected_code. Got $code\n"
	else
		if [ "$output" != "$expected_output" ] ; then
			printf "[FAILED] $test_name ... expecting output to be '$expected_output' or '$expected_output_alt'. Got '$output'\n"
		else
			printf "[OK]     $test_name\n"
		fi
	fi
}

post() {
	test_name=$1;shift
	path=$1;shift
	value=$1;shift
	expected_code=$1;shift

	output=$(restctl post "$path" "$value")
	code=$?
	if [ "$code" != "$expected_code" ] ; then
		printf "[FAILED] $test_name ... expecting exit code to be $expected_code. Got $code\n"
	else
		if [ "$output" != "" ] ; then
			printf "[OK]     $test_name ... '$output'\n"
		else
			printf "[FAILED] $test_name ... expecting output to be '$expected_output'. Got '$output'\n"
		fi
	fi
	export POST_UUID="$output"
}

put() {
	test_name=$1;shift
	path=$1;shift
	value=$1;shift
	expected_code=$1;shift
	expected_output=$1;shift

	output=$(restctl put "$path" "$value")
	code=$?
	if [ "$code" != "$expected_code" ] ; then
		printf "[FAILED] $test_name ... expecting exit code to be $expected_code. Got $code\n"
	else
		if [ "$output" != "$expected_output" ] ; then
			printf "[FAILED] $test_name ... expecting output to be '$expected_output'. Got '$output'\n"
		else
			printf "[OK]     $test_name\n"
		fi
	fi
}

del() {
	test_name=$1;shift
	path=$1;shift
	expected_code=$1;shift
	expected_output=$1;shift

	output=$(restctl delete "$path")
	code=$?
	if [ "$code" != "$expected_code" ] ; then
		printf "[FAILED] $test_name ... expecting exit code to be $expected_code. Got $code\n"
	else
		if [ "$output" != "$expected_output" ] ; then
			printf "[FAILED] $test_name ... expecting output to be '$expected_output'. Got '$output'\n"
		else
			printf "[OK]     $test_name\n"
		fi
	fi
}

# kv
printf "\n\nTesting Key/Value Store\n"
get "get key that does not exists" "/store/api/v1/key/key-that-does-not-exists" 1 ""
put "set key with a string" "/store/api/v1/key/key-as-string" "simple string" 0 ""
get "get key with a string" "/store/api/v1/key/key-as-string" 0 "simple string"

del "del key that does not exists" "/store/api/v1/key/key-that-does-not-exists" 0 ""
del "del key with a string" "/store/api/v1/key/key-as-string" 0 ""
get "get key with a string" "/store/api/v1/key/key-as-string" 1 ""

post "creating a nameless string" "/store/api/v1/key" "nameless string" 0 ; UUID="${POST_UUID}"
get "get nameless key with a string" "/store/api/v1/key/${UUID}" 0 "nameless string"
del "del allkeys" "/store/api/v1/key?force=true" 0 ""


# sets
printf "\n\nTesting Sets\n"
get "get content of set that does not exits" "/store/api/v1/set/set-that-does-not-exists" 0 "[]"
get "get a member of a set that does not exits" "/store/api/v1/set/set-that-does-not-exists/bob" 1 ""
put "creating a set with one element" "/store/api/v1/set/family" "bob" 0 ""
get "test element" "/store/api/v1/set/family/bob" 0 ""
get "get all elements of the set" "/store/api/v1/set/family" 0 "[\"bob\"]"
put "adding an element to the set" "/store/api/v1/set/family" "john smith" 0 ""
get "test element" "/store/api/v1/set/family/john%20smith" 0 ""
get "get all elements of the set" "/store/api/v1/set/family" 0 "[\"john smith\",\"bob\"]" "[\"bob\",\"john smith\"]"
get "get element that does not exists in an existing set" "/store/api/v1/set/family/boby" 1 ""

del "remove an element that does not exits from inexisting set" "/store/api/v1/set/set-that-does-not-exists/boby" 0 ""
del "remove an element that does not exits from existing set" "/store/api/v1/set/family/boby" 0 ""
del "remove an element from existing set" "/store/api/v1/set/family/john%20smith" 0 ""
get "get element that has been removed" "/store/api/v1/set/family/john%20smith" 1 ""
get "get all elements of the set" "/store/api/v1/set/family" 0 "[\"bob\"]"
del "destroying the whole inexistant set" "/store/api/v1/set/set-that-does-not-exists?force=true" 0 ""
del "destroying the whole set" "/store/api/v1/set/family?force=true" 0 ""
get "get all elements of the set" "/store/api/v1/set/family" 0 "[]"











