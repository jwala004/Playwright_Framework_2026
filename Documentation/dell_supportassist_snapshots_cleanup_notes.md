# Cleaning Up Dell SupportAssist System Repair Snapshots on Windows

**Purpose:** Reference notes for investigating and reclaiming disk space
consumed by Dell SupportAssist Remediation snapshots under
`C:\ProgramData\Dell\SARemediation`.

> **Important:** These instructions describe a specific cleanup
> scenario, not a recommendation to delete every Dell recovery folder.
> The `Snapshots\Backup` folder may contain data needed by Dell System
> Repair to restore software or system state. Deleting it is permanent
> and removes those recovery copies. Proceed only if you accept losing
> those recovery points and have another recovery plan.

## 1. What the folder was

In the case documented here, WizTree showed a very large directory:

``` text
C:\ProgramData\Dell\SARemediation\SystemRepair\Snapshots\Backup
```

WizTree initially reported approximately **67.7 GB** for `Backup`, and
approximately **69.4 GB** for the parent `Snapshots` directory. The
folder contained tens of thousands of files, including `.msp`, `.dll`,
`.exe`, `.manifest`, `.mui`, `.cat`, `.xml`, and other files. Sample
signatures identified Adobe, Microsoft, and Dell publishers. This was
consistent with captured software/recovery data, not ordinary personal
documents.

File extensions and digital signatures alone do **not** prove that a
file is safe to delete. The important contextual clues were its location
inside Dell's System Repair snapshot store and the user's decision to
discard those stored recovery points.

## 2. Before you begin

1.  **Confirm the path** in WizTree. Do not assume every large folder
    named `Backup` is disposable.
2.  **Run WizTree as administrator** and rescan the drive so the size is
    current.
3.  Open **Command Prompt as administrator** or **PowerShell as
    administrator**, as appropriate.
4.  If available, use Dell SupportAssist/System Repair's own controls to
    disable or remove snapshots first. In this case, System Repair
    displayed "This feature is temporarily unavailable."
5.  Identify the service and its configuration before stopping it:

``` cmd
sc query "Dell SupportAssist Remediation"
sc qc "Dell SupportAssist Remediation"
```

In this case, the service was running as `LocalSystem` from:

``` text
C:\Program Files\Dell\SARemediation\agent\DellSupportAssistRemedationService.exe
```

The application did not appear in Installed apps/Programs and Features,
but the service was still registered and running.

## 3. Stop the remediation service

Run in **Administrator Command Prompt**:

``` cmd
sc stop "Dell SupportAssist Remediation"
sc query "Dell SupportAssist Remediation"
```

Wait until the service reports:

``` text
STATE : 1 STOPPED
```

Stopping the service does not delete data. It may be appropriate to stop
the component before examining its recovery store. Do not stop unrelated
Dell services.

## 4. Confirm the directory and inspect its contents

List the parent:

``` cmd
dir /a "C:\ProgramData\Dell\SARemediation\SystemRepair"
```

List the snapshot folder:

``` cmd
dir /a "C:\ProgramData\Dell\SARemediation\SystemRepair\Snapshots"
```

List the `Backup` folder:

``` cmd
dir /a "C:\ProgramData\Dell\SARemediation\SystemRepair\Snapshots\Backup"
```

If the parent lists `Snapshots` or `Backup`, but listing that directory
returns `File Not Found` or access errors, do not assume the folder is
empty. WizTree may still show its contents. Investigate access and
confirm with a fresh WizTree scan.

### Optional PowerShell inspection

Run in **PowerShell** (not CMD):

``` powershell
$p = 'C:\ProgramData\Dell\SARemediation\SystemRepair\Snapshots\Backup'

Get-ChildItem -LiteralPath $p -Force |
    Select-Object -First 30 Mode, Length, LastWriteTime, Name |
    Format-Table -AutoSize
```

Largest files:

``` powershell
Get-ChildItem -LiteralPath $p -Force -File -Recurse -ErrorAction SilentlyContinue |
    Sort-Object Length -Descending |
    Select-Object -First 20 FullName, Length, LastWriteTime |
    Format-Table -AutoSize
```

File-type counts:

``` powershell
Get-ChildItem -LiteralPath $p -Force -File -Recurse -ErrorAction SilentlyContinue |
    Group-Object Extension |
    Sort-Object Count -Descending |
    Select-Object -First 20 Count, Name |
    Format-Table -AutoSize
```

Optional signature/product metadata check for the largest DLL/EXE files:

``` powershell
Get-ChildItem -LiteralPath $p -Force -File |
    Where-Object { $_.Extension -in '.dll', '.exe', '.msp' } |
    Sort-Object Length -Descending |
    Select-Object -First 10 |
    ForEach-Object {
        $sig = Get-AuthenticodeSignature -LiteralPath $_.FullName
        $ver = [System.Diagnostics.FileVersionInfo]::GetVersionInfo($_.FullName)

        [PSCustomObject]@{
            File      = $_.Name
            SizeMB    = [math]::Round($_.Length / 1MB, 1)
            Publisher = if ($sig.SignerCertificate) { $sig.SignerCertificate.Subject } else { '(no signer certificate)' }
            Signature = $sig.Status
            Product   = $ver.ProductName
            Version   = $ver.FileVersion
        }
    } | Format-List
```

This reads metadata; it does not establish whether Dell's recovery
feature still needs those files.

## 5. If access is denied: take ownership and grant permissions

In the documented case, the administrator could inspect the ACL of
`Snapshots`, but could not list its contents. Taking ownership of the
directory and granting the Administrators group full control made the
contents visible.

**Use this only for the specific `Backup` directory you have decided to
remove. Do not apply it to the whole `C:\ProgramData`,
`C:\ProgramData\Dell`, or Windows folders.** Changing permissions is a
security-relevant change.

First, try the specific folder (Administrator CMD):

``` cmd
takeown /f "C:\ProgramData\Dell\SARemediation\SystemRepair\Snapshots\Backup" /a
icacls "C:\ProgramData\Dell\SARemediation\SystemRepair\Snapshots\Backup" /grant *S-1-5-32-544:F
```

If individual files still return access-denied errors, and you have
confirmed that the entire `Backup` tree is the intended deletion target,
apply ownership recursively:

``` cmd
takeown /f "C:\ProgramData\Dell\SARemediation\SystemRepair\Snapshots\Backup" /r /d Y
```

Then grant the built-in Administrators group full control recursively:

``` cmd
icacls "C:\ProgramData\Dell\SARemediation\SystemRepair\Snapshots\Backup" /grant *S-1-5-32-544:(OI)(CI)F /t /c
```

Wait for each command to finish. Check the final summary. In the
documented case, both recursive commands processed **267,223 entries
with zero failures**.

-   `/r` for `takeown`: process files and subdirectories recursively.
-   `/t` for `icacls`: process files and subdirectories recursively.
-   `/c` for `icacls`: continue after individual errors; inspect the
    final failure count.
-   `*S-1-5-32-544` identifies the built-in Administrators group,
    independent of the Windows display language.
-   `(OI)(CI)` makes the granted permissions inheritable by files and
    directories.

If these commands fail, do not keep escalating to broader permission
changes. Investigate the exact error first.

## 6. Delete the `Backup` directory

**Warning: This permanently removes the contents of the Dell recovery
backup store. It does not move the data to the Recycle Bin. Confirm the
path carefully before pressing Enter.**

### Option A --- Command Prompt (CMD)

Run in **Administrator Command Prompt**:

``` cmd
rd /s /q "C:\ProgramData\Dell\SARemediation\SystemRepair\Snapshots\Backup"
```

-   `rd` (`rmdir`) removes a directory.
-   `/s` removes all contents and subdirectories.
-   `/q` suppresses confirmation prompts.

### Option B --- PowerShell

Run in **PowerShell as administrator**:

``` powershell
Remove-Item -LiteralPath 'C:\ProgramData\Dell\SARemediation\SystemRepair\Snapshots\Backup' -Recurse -Force
```

`Remove-Item` is a PowerShell command. It is **not** recognized in CMD.
If you see `'Remove-Item' is not recognized`, you are in Command Prompt;
either use the `rd` command above or open PowerShell.

### If deletion reports access denied

1.  Stop the repeated command with `Ctrl+C`.
2.  Confirm the Remediation service is stopped.
3.  Check whether recursive ownership and ACL changes completed, and
    inspect their failure counts.
4.  Retry only after the access issue has been resolved.
5.  Do not delete the service executable, use broad permission changes,
    or run destructive commands against the parent `Snapshots` directory
    as a workaround.

Deleting tens of thousands of files can take several minutes. Do not
start a second deletion command while one is still running. If the
command reports errors, some files may already have been removed; check
the folder size and contents before retrying.

## 7. Verify the result

Check whether the `Backup` directory still exists.

### CMD

``` cmd
dir /a "C:\ProgramData\Dell\SARemediation\SystemRepair\Snapshots"
```

### PowerShell

``` powershell
Test-Path 'C:\ProgramData\Dell\SARemediation\SystemRepair\Snapshots\Backup'
```

`False` means the path no longer exists.

Then:

1.  Run a **fresh scan** of C: in WizTree as administrator.
2.  Check the `Snapshots` and `SystemRepair` sizes.
3.  Check actual free space in Windows:

``` cmd
fsutil volume diskfree C:
```

### Important: folder size is not the same as free space gained

WizTree may report logical size and allocated size separately. Hard
links, compression, filesystem accounting, and differences between
earlier and current scans can make the free-space gain differ from the
displayed folder size. Compare a fresh scan and the Windows free-space
reading; do not assume that every displayed gigabyte will become a
gigabyte of free space.

In this case, after removing `Backup`, WizTree showed approximately
**1.6 GB** remaining under `SystemRepair`, and Windows reported about
**82.4 GiB free**. The earlier free-space estimate was approximately
37--38 GB, so free space increased substantially, but by less than the
original 67.7 GB folder-size reading.

## 8. Optional: prevent the Remediation service from starting automatically

In the documented case, the user chose to disable the service because
the normal System Repair controls were unavailable and they did not want
the service to recreate recovery data.

First verify it is stopped:

``` cmd
sc query "Dell SupportAssist Remediation"
```

To disable automatic startup (Administrator CMD):

``` cmd
sc config "Dell SupportAssist Remediation" start= disabled
```

Note the required space after `start=`.

Verify the configuration:

``` cmd
sc qc "Dell SupportAssist Remediation"
```

Expected configuration:

``` text
START_TYPE         : 4   DISABLED
```

**Trade-off:** This prevents the service from starting automatically and
disables the associated Dell SupportAssist Remediation/System Repair
functionality. It is not required for deleting the folder itself. Do
this only if you accept losing that automatic recovery functionality. Do
not delete the service registration or its executable merely to save
disk space.

## 9. What to keep

In this case, the user kept the remaining files directly inside
`Snapshots`, including timestamped `.inp` files, XML metadata,
`Base.sqlite`, and an empty `Temp` directory. Those items totaled
approximately 1.75 GB before the cleanup.

Leaving them intact was a conservative choice. Do not delete the
remaining metadata just to save a relatively small amount of additional
space unless you have a separate, well-understood reason.

## 10. Troubleshooting quick reference

  -----------------------------------------------------------------------
  Symptom                             Recommended response
  ----------------------------------- -----------------------------------
  `dir` returns `File Not Found`, but Run WizTree elevated; inspect the
  WizTree shows data                  exact path and ACL before
                                      concluding the directory is empty.

  `fsutil reparsepoint query` returns This alone does not prove a reparse
  `Access is denied`                  point exists. Do not infer the
                                      cause from this error alone.

  `takeown` succeeds on the folder,   Apply ownership and permissions
  but file deletion still fails       recursively to the exact target
                                      only, then inspect failure counts.

  `Remove-Item` is not recognized     You are in CMD, not PowerShell. Use
                                      `rd /s /q` or open PowerShell.

  Deletion takes several minutes      Normal for a very large tree; wait
                                      while it is processing. Do not
                                      launch another deletion at the same
                                      time.

  WizTree size is larger than the     Compare logical and allocated size
  free-space increase                 and check
                                      `fsutil volume diskfree C:` after a
                                      fresh scan.

  Service still exists but the app is Inspect with `sc query` and
  absent from Installed apps          `sc qc`; do not assume the service
                                      is absent merely because the app is
                                      not listed.
  -----------------------------------------------------------------------

## 11. Checklist

-   [ ] Confirmed the exact target path in WizTree.
-   [ ] Accepted the loss of Dell's stored recovery snapshots.
-   [ ] Stopped the Dell SupportAssist Remediation service.
-   [ ] Inspected the target folder and verified it was recovery-store
    data.
-   [ ] Applied ownership/permissions only to the target tree if
    necessary.
-   [ ] Deleted only `Snapshots\Backup`, not the entire `Snapshots` or
    `Dell` directory.
-   [ ] Confirmed the `Backup` folder no longer exists.
-   [ ] Rescanned C: in WizTree and checked `fsutil volume diskfree C:`.
-   [ ] Decided whether disabling the Remediation service's automatic
    startup is appropriate.

------------------------------------------------------------------------

**General advice:** Prefer the vendor's supported cleanup controls where
they work. Manual deletion is a fallback for a specific, understood
recovery store---not a universal cleanup recipe for all folders under
`ProgramData`.
