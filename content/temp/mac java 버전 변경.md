```bash

JDKS_DIR="/Library/Java/JavaVirtualMachines"
JDKS=( $(ls ${JDKS_DIR}) )
JDKS_STATES=()

for (( i = 0; i < ${#JDKS[@]}; i++ )); do
	if [ -f "${JDKS_DIR}/${JDKS[$i](%20-f%20"${JDKS_DIR}/${JDKS[$i); then
		JDKS_STATES[${i}]=enable
	else
		JDKS_STATES[${i}]=disable
	fi
	echo "${i} ${JDKS[$i]} ${JDKS_STATES[$i]}"
done

DEFAULT_JDK_DIR=""
DEFAULT_JDK=""
OPTION=""

while [](%20!%20"$OPTION"%20=~%20^[0-9]+$%20||%20OPTION%20-ge%20"${#JDKS[@]}"%20); do
	read -p "Enter Default JDK: "  OPTION
	if [ ! "$OPTION" =~ ^[0-9](%20!%20"$OPTION"%20=~%20^[0-9); then
		echo "Sorry integers only"
	fi

	if [](%20OPTION%20-ge%20"${#JDKS[@]}"%20); then
		echo "Out of index"
	fi
done

DEFAULT_JDK_DIR="${JDKS_DIR}/${JDKS[$OPTION]}"
DEFAULT_JDK="${JDKS[$OPTION]}"

for (( i = 0; i < ${#JDKS[@]}; i++ )); do
	if [ -f "${JDKS_DIR}/${JDKS[$i](%20-f%20"${JDKS_DIR}/${JDKS[$i); then
		sudo mv "${JDKS_DIR}/${JDKS[$i]}/Contents/Info.plist" "${JDKS_DIR}/${JDKS[$i]}/Contents/Info.plist.disable"
	fi
done

if [ -f "${DEFAULT_JDK_DIR}/Contents/Info.plist.disable" ](%20-f%20"${DEFAULT_JDK_DIR}/Contents/Info.plist.disable"%20); then
	sudo mv "${DEFAULT_JDK_DIR}/Contents/Info.plist.disable" "${DEFAULT_JDK_DIR}/Contents/Info.plist"
	echo "Enable ${DEFAULT_JDK} as default JDK"
fi
```